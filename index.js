const Pageres = require('pageres');

const pageres = new Pageres({delay: 5})
    .src('m.feawin.com', ['480x320'],{selector:"#twitter-widget-0"})
    .dest(__dirname)
    .run()
    .then(() => console.log('done'));