
'use strict';

const restify = require('restify');
const server = restify.createServer();
const axios = require('axios');
const md5 = require('md5');
const Pageres = require('pageres');

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

server.post('/twitter/origin', function(req, res, next){

    let url = req.params.url;

    axios.get("https://publish.twitter.com/oembed",{url:url}).then((result)=>{
        return result.data;
    }).then((result)=>{
        if(result.html){
            res.send(result.html)
        }else{
            res.send("")
        }
    })
})

server.post('/twitter/get', function(req, res, next){

    let url = req.params.url;
    let filename = md5(url)
    url = encodeURIComponent(url)
    new Pageres({delay: 1})
        .src('localhost!twitter!origin?url='+url, ['480x320'],{selector:"#twitter-widget-0",transparent:true,filename:filename})
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