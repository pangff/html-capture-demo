
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

new Pageres({delay: 2})
    .src("https://m.weibo.cn/status/F4RYjg1f9", ['480x320'],{selector:"div.card.m-panel.card9",transparent:true,filename:"12"})
    .dest(path.join(__dirname,"./images"))
    .run().then((result)=>{
        console.log("done")
    }).catch((e)=>{
        console.log(e)
    })
