const Pageres = require('pageres');

const pageres = new Pageres({delay: 5})
    .src('m.feawin.com!scene/client/share.html', ['480x320', '1024x768', 'iphone 5s'],{filename:"test"})
    .dest(__dirname)
    .run()
    .then(() => console.log('done'));