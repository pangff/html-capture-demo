
'use strict';

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
        console.log(result)
        if(result.html){
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                        </head>
                        <body id="body">`
            let end = `</body></html>`;
            let result = html+result.html+end;
            console.log(result)
            res.write(result);
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
    new Pageres({delay: 5})
        .src(requestUrl, ['480x320'],{selector:"#twitter-widget-0",transparent:true,filename:filename})
        .dest(path.join(__dirname,"./images"))
        .run()
        .then(() => {
            console.log('done')
            res.send({status:"success",imageUrl:"http://47.89.252.43/images/"+filename+".png"})
            next();
        });
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