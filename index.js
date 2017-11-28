
'use strict';
const errors = require('restify-errors');
const restify = require('restify');
const path = require('path');
const server = restify.createServer();
const axios = require('axios');
const md5 = require('md5');
const Pageres = require('pageres');
const filenamifyUrl = require('filenamify-url');

const { URL } = require('url');


const plugins = [
    restify.plugins.acceptParser(server.acceptable),
    restify.plugins.dateParser(),
    restify.plugins.queryParser({
        mapParams: true
    }),
    restify.plugins.fullResponse(),
    restify.plugins.bodyParser({
        mapParams: true,
        keepExtensions: true,
        multiples: true
    })
];

server.use(plugins);

server.get('/:url', function(req, res, next){

    let url = req.params.url;
    url = new Buffer(url,"base64").toString();

    const myURL = new URL(url);

    if(myURL.host=="www.facebook.com"){
        let html = `<html>
                    <title>My Website</title>
                    <body>
                    <script src="//connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v2.5"
                    async></script>
                    <div id="myContent" class="fb-post"
                    data-href="https://www.facebook.com/20531316728/posts/10154009990506729/"
                    data-width="500"></div>
                        </body>
                        </html>`;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();
        return next();
    }else{
        axios.get(url).then((result)=>{
            return result.data;
        }).then((result)=>{
            if(result.html){

                if(myURL.host=="www.twitter.com"){
                    let html = `<!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                        </head>
                        <body id="body">`
                    let end = `</body></html>`;
                    let results = html+result.html+end;
                    console.log(results)

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    res.write(results);
                    res.end();
                    return next();
                }

            }else{
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write("");
                res.end();
                return next();
            }
        }).catch((e)=>{
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write("");
            res.end();
            return next();
            console.log(e)
        })
    }

})


server.get('/twitter/get', function(req, res, next){
    let url = new Buffer(req.params.url,"base64").toString();

    console.log("url:"+url)

    const myURL = new URL(url);

    let captureTag = "";
    let requestUrl = "";
    let isTwritter = false;
    console.log("host",myURL.host)
    if(myURL.host=="twitter.com"){
        isTwritter = true;
        url = "https://publish.twitter.com/oembed?url="+url;
        let urlBase64 = new Buffer(url).toString("base64");
        requestUrl = "http://localhost/"+urlBase64;
        captureTag="#twitter-widget-0"
    }else if(myURL.host=="www.weibo.com"){

        captureTag = "#plc_main";
        requestUrl = url;
    }else if(myURL.host=="www.facebook.com"){
        captureTag = "div._1dwg._1w_m._q7o";
        let urlBase64 = new Buffer(url).toString("base64");
        requestUrl= "http://localhost/"+urlBase64;
    }else{
        captureTag = "#myContent";
        requestUrl = url;
    }

    console.log("captureTag",captureTag)
    let filename = md5(url)
    console.log("filename:"+filename)


    if(isTwritter){
        Promise.all([axios.get(url).then((result)=>{
            return result.data;
        }),new Pageres({delay: 5})
            .src(requestUrl, ['480x320'],{selector:captureTag,transparent:true,filename:filename})
            .dest(path.join(__dirname,"./images"))
            .run()]).then((result)=>{
            if(result){
                result[0].imgUrl = "images/"+filename+".png"
                result[0].status = "success";
                res.send(result[0])
                return next();
            }else{
                return next(new errors.InternalServerError("result null"));
            }
        }).catch((e)=>{
            console.error(e)
            return next(new errors.InternalServerError(e));
        })
    }else{
        return new Pageres({delay: 5})
            .src(requestUrl, ['480x320'],{transparent:true,filename:filename})
            .dest(path.join(__dirname,"./images"))
            .run().then((result)=>{
            if(result){
                result.imgUrl = "images/"+filename+".png"
                result.status = "success";
                res.send(result)
                return next();
            }else{
                return next(new errors.InternalServerError("result null"));
            }
        }).catch((e)=>{
            console.error(e)
            return next(new errors.InternalServerError(e));
        })
    }

});

server.get(/\/images\/?.*/, restify.plugins.serveStatic({
    directory: __dirname
}));

/**
 * 启动服务
 */
server.listen("3000", function() {
    console.log('%s listening at %s', server.name, server.url);
});