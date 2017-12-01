
'use strict';
const errors = require('restify-errors');
const restify = require('restify');
const path = require('path');
const server = restify.createServer();
const fs = require('fs');
const moduleRegister = require('./module-register');


//server.use(
//    function crossOrigin(req,res,next){
//        res.header("Access-Control-Allow-Origin", "*");
//        res.header("Access-Control-Allow-Headers", "X-Requested-With");
//        return next();
//    }
//);
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

let moduleAppDir = path.join(__dirname,"route");
let appModules = fs.readdirSync(moduleAppDir);
moduleRegister.register(server,"route",appModules)


server.get(/\/images\/?.*/, restify.plugins.serveStatic({
    directory: __dirname
}));

/**
 * 启动服务
 */
server.listen("3000", function() {
    console.log('%s listening at %s', server.name, server.url);
});