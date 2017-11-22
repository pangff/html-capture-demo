const Pageres = require('pageres');

const pageres = new Pageres({delay: 2})
    .src('m.feawin.com', ['480x320', '1024x768', 'iphone 5s'],{selector:"#twitter-widget-0"})
    .dest(__dirname)
    .run()
    .then(() => console.log('done'));