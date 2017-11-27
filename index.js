
'use strict';
const errors = require('restify-errors');
const restify = require('restify');
const path = require('path');
const server = restify.createServer();
const axios = require('axios');
const md5 = require('md5');
const Pageres = require('pageres');
const filenamifyUrl = require('filenamify-url');
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
    axios.get("https://publish.twitter.com/oembed?url="+url).then((result)=>{
        return result.data;
    }).then((result)=>{
        if(result.html){
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
})


server.get('/twitter/get', function(req, res, next){

    let url = req.params.url;
    console.log("url:"+url)
    let filename = md5(url)
    console.log("filename:"+filename)
    url = new Buffer(url).toString("base64");
    let requestUrl = "http://localhost/"+url;

    Promise.all(axios.get("https://publish.twitter.com/oembed?url="+url).then((result)=>{
        return result.data;
    }),new Pageres({delay: 5})
        .src(requestUrl, ['480x320'],{selector:"#twitter-widget-0",transparent:true,filename:filename})
        .dest(path.join(__dirname,"./images"))
        .run()).then((result)=>{
        if(result){
            result[0].twitterImgUrl = "images/"+filename+".png"
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
});

server.get(/\/images\/?.*/, restify.plugins.serveStatic({
    directory: __dirname
}));

/**
 * 启动服务
 */
server.listen("80", function() {
    console.log('%s listening at %s', server.name, server.url);
});