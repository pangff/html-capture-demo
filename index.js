const casper = require('casper').create();

casper.start('http://m.feawin.com', function() {

});
// listener function for requested resources
var listener = function(resource, request) {
    setTimeout(function(){
        this.captureSelector('twitter.png', '#twitter-block');
    },2000);
};

// listening to all resources requests
casper.on("load.finished", listener);

casper.run();
//const filenamifyUrl = require('filenamify-url');
//const path = require('path');
//let url = filenamifyUrl("http://m.feawin.com")
//const pageres = new Pageres({delay: 10})
//    .src(url, ['480x320', '1024x768', 'iphone 5s'])
//    .dest(path.join(__dirname,"./images"))
//    .run()
//    .then(() => console.log('done'));

