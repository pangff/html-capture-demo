const Pageres = require('pageres');

const pageres = new Pageres({delay: 2})
    .src('m.feawin.com', ['480x320'],{selector:"#shadow-root"})
    .dest(__dirname)
    .run()
    .then(() => console.log('done'));