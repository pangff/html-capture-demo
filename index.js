const casper = require('casper').create();

casper.start('http://m.feawin.com', function() {

});
// listener function for requested resources
var listener = function() {

    var _this = this;
    this.wait(2000,function(){
        console.log("22222")
        _this.captureSelector('twitter2.png', '#twitter-block');
    });
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

