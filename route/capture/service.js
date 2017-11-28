
'use strict';
const path = require('path');
const axios = require('axios');
const md5 = require('md5');
const Pageres = require('pageres');
const filenamifyUrl = require('filenamify-url');
const cheerio = require('cheerio')
const CaptureService = module.exports = {};
const request = require('request');
const rp = require('request-promise');
const { URL } = require('url');
const TYPE_TWITTER = "twitter";
const TYPE_FACEBOOK = "facebook";
const TYPE_WEIBO = "weibo";
const TYPE_CHINA_NET = "chinaNet";
const TYPE_OTHERS = "others";
const fs = require('fs');
/**
 * 判断平台类型
 * @param url
 */
CaptureService.checkPlatform=(url)=>{
    const myURL = new URL(url);
    if(myURL.host=="twitter.com"||myURL.host=="www.twitter.com"){
        return TYPE_TWITTER;
    }else if(myURL.host=="www.facebook.com"||myURL.host=="facebook.com"){
        return TYPE_FACEBOOK;
    }else if(myURL.host=="weibo.com"||myURL.host=="www.weibo.com"||myURL.host=="m.weibo.com"){
        return TYPE_WEIBO;
    }else if(myURL.host=="wx.china.cn"
        ||myURL.host=="m.china.com.cn"
        ||myURL.host=="news.china.com.cn"
        ||myURL.host=="www.china.org.cn"){
        return TYPE_CHINA_NET;
    }else{
        return TYPE_OTHERS;
    }
}

/**
 * 获取平台title
 * @param url
 */
CaptureService.getPlatformInfo=(url)=>{
    const myURL = new URL(url);
    let filename = md5(url)
    let type = CaptureService.checkPlatform(url);
    if(type==TYPE_TWITTER){
        url = "https://publish.twitter.com/oembed?url="+url;
        let urlBase64 = new Buffer(url).toString("base64");
        return {
            requestUrl : "http://localhost/content/"+urlBase64,
            captureTag: "#twitter-widget-0",
            filename:filename,
            quoteTitle:"twitter"
        }
    }else if(type==TYPE_FACEBOOK){
        let urlBase64 = new Buffer(url).toString("base64");
        return {
            requestUrl : "http://localhost/content/"+urlBase64,
            captureTag: "#myContent",
            filename:filename,
            quoteTitle:"facebook"
        }
    }else if(type==TYPE_WEIBO){
        let paths = myURL.pathname.split("/");
        let id = paths[paths.length-1];
        return {
            requestUrl : "https://m.weibo.cn/status/"+id,
            captureTag: "div.card.m-panel.card9",
            filename:filename,
            quoteTitle:"新浪微博"
        }
    }else if(type==TYPE_CHINA_NET){
        return {
            requestUrl : url,
            captureTag: "",
            quoteTitle:"中国网"
        }
    }else if(type==TYPE_CHINA_NET){
        return {
            requestUrl : url,
            captureTag: "",
            quoteTitle:""
        }
    }else{
        return {
            requestUrl : url,
            captureTag: "",
            quoteTitle:""
        }
    }
}


CaptureService.getEebeddedContent=(url)=>{
    url = new Buffer(url,"base64").toString();
    let type = CaptureService.checkPlatform(url);
    if(type==TYPE_FACEBOOK){
        let html = `<html><title>Website</title><body><script src="http://connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v2.5" async></script>
                    <div id="myContent" class="fb-post"
                    data-href="${url}"
                    data-width="500"></div> </body> </html>`;
        return Pormise.resolve(html);
    }else if(type==TYPE_TWITTER){
        return axios.get(url).then((result)=>{
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
                return results;
            }else{
                return "";
            }
        })
    }else{
        return Promise.resolve("")
    }
}

const doCapture=(info)=>{
    if(info.filename && fs.existsSync(path.join(__dirname,"../../images"+info.filename))){
        return Promise.resolve(info.filename);
    }else{
        return new Pageres({delay: 2})
            .src(info.requestUrl, ['480x320'],{selector:info.captureTag,transparent:true,filename:info.filename})
            .dest(path.join(__dirname,"../../images"))
            .run()
    }
}

CaptureService.getHtmlOrCaptureInfo=(url)=>{
    let type = CaptureService.checkPlatform(url);
    let info = CaptureService.getPlatformInfo(url);

    if(type==TYPE_TWITTER){
        url = "https://publish.twitter.com/oembed?url="+url;
        return Promise.all([axios.get(url).then((result)=>{
            return result.data;
        }),doCapture(info)]).then((result)=>{
            if(result){
                return {
                    status:"success",
                    imgUrl: "images/"+info.filename+".png",
                    info:info,
                    data:result[0]
                }
            }else{
                return Promise.reject("result null");
            }
        })
    }else if(type==TYPE_FACEBOOK || type==TYPE_WEIBO){
        return doCapture(info).then((result)=>{
                if(result){
                    return {
                        status:"success",
                        info:info,
                        imgUrl: "images/"+info.filename+".png"
                    }
                }else{
                    return Promise.reject("result null");
                }
            })
    }else if(type==TYPE_CHINA_NET || type==TYPE_OTHERS){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        return rp(options).then(($)=>{
            let title = $("title").text()
            let images = $("img").map(function() {
                return $(this).attr("src");
            }).get()
            let imgUrl = "";
            if(images && images.length>0){
                imgUrl = images[0]
            }else if(type==TYPE_CHINA_NET){
                imgUrl = "http://m.china.com.cn/images/app/appicon.png";
            }
            return {
                status:"success",
                info:info,
                fetch:{
                    title:title,
                    imgUrl:imgUrl
                }
            }
        })
    }

}
