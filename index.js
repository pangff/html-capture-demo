
'use strict';

const restify = require('restify');
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

server.get('/twitter/origin', function(req, res, next){

    let url = req.params.url;
    console.log("/twitter/origin")
    axios.get("https://publish.twitter.com/oembed",{url:url}).then((result)=>{
        return result.data;
    }).then((result)=>{
        console.log(result)
        if(result.html){
            res.send(result.html)
        }else{
            res.send("")
        }
    })
})

server.get('/twitter/get', function(req, res, next){

    let url = req.params.url;
    let filename = md5(url)
    url = encodeURIComponent(url)
    let requestUrl = filenamifyUrl("http://localhost/twitter/origin?url="+url);
    console.log("requestUrl:"+requestUrl)
    new Pageres({delay: 1})
        .src(requestUrl, ['480x320'],{selector:"#twitter-widget-0",transparent:true,filename:filename})
        .dest(__dirname)
        .run()
        .then(() => console.log('done'));
});


/**
 * 启动服务
 */
server.listen("80", function() {
    console.log('%s listening at %s', server.name, server.url);
});