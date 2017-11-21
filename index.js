const Pageres = require('pageres');
const casper = require('casper').create();

casper.start('http://m.feawin.com', function() {

});
// listener function for requested resources
var listener = function(resource, request) {
    this.captureSelector('twitter.png', '#twitter-block');
};

// listening to all resources requests
casper.on("resource.requested", listener);

casper.run();
//const filenamifyUrl = require('filenamify-url');
//const path = require('path');
//let url = filenamifyUrl("http://m.feawin.com")
//const pageres = new Pageres({delay: 10})
//    .src(url, ['480x320', '1024x768', 'iphone 5s'])
//    .dest(path.join(__dirname,"./images"))
//    .run()
//    .then(() => console.log('done'));

