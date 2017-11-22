const Pageres = require('pageres');

const pageres = new Pageres({delay: 1})
    .src('m.feawin.com', ['480x320'],{selector:"#twitter-widget-0",transparent:true})
    .dest(__dirname)
    .run()
    .then(() => console.log('done'));