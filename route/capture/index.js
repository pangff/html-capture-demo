'use strict';

const errors = require('restify-errors');
const path = require('path');
const service = require('./service');
/**
 /**
 * Routes
 */

const routes = [];


/**
 * 获取举报列表
 */
routes.push({
    meta: {
        name: 'quoteGET',
        method: 'GET',
        paths: [
            '/quote/get'
        ],
        version: '1.0.0'
    },
    filter: (req, res, next) => {
        return next();
    },
    action: (req, res, next) => {
        let url = req.params.url;
        return service.getHtmlOrCaptureInfo(url).then((r)=>{
            console.log(r)
            res.send(r);
            return next();
        }).catch((error)=>{
            let message = JSON.stringify({message: error.message, stack: error.stack})
            return next(new errors.InternalServerError(message));
        })
    },
    finish: (req, res, next) => {
        return next();
    }
});

/**
 * 获取举报列表
 */
routes.push({
    meta: {
        name: 'quoteContent',
        method: 'GET',
        paths: [
            '/content/:url'
        ],
        version: '1.0.0'
    },
    filter: (req, res, next) => {

        return next();
    },
    action: (req, res, next) => {
        let url = req.params.url;
        return service.getEebeddedContent(url).then((r)=>{
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(r);
            res.end();
        }).catch((error)=>{
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write("");
            res.end();
        })
    },
    finish: (req, res, next) => {
        return next();
    }
});


/**
 * Export
 */

module.exports = routes;