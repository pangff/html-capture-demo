const Pageres = require('pageres');
const filenamifyUrl = require('filenamify-url');
let url = filenamifyUrl("http://www.baidu.com")
const pageres = new Pageres({delay: 10})
    .src(url, ['480x320', '1024x768', 'iphone 5s'])
    .dest(__dirname)
    .run()
    .then(() => console.log('done'));