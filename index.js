const Pageres = require('pageres');
const filenamifyUrl = require('filenamify-url');
let url = filenamifyUrl("http://m.feawin.com/scene/client/share.html")
const pageres = new Pageres({delay: 10})
    .src(url, ['480x320', '1024x768', 'iphone 5s'])
    .dest(path.join(__dirname,"./images"))
    .run()
    .then(() => console.log('done'));