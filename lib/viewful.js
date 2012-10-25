var viewful = exports;

var utile    = require('utile'),
    path     = require('path'),
    fs       = require('fs'),
    broadway = require("broadway"),
    plugins  = fs.readdirSync(__dirname + '/engines');

viewful.engines = new broadway.App();

plugins.forEach(function(item){
  viewful.engines.use(require("./engines/" + item), { "delimiter": "!" } );
});

viewful.engines.init(function (err) {
  if (err) {
    //console.log(err);
  }
});

viewful.View = require('./view');

//
// Remark:
//
//    Server-Side Load = fs module
//    Client-Side Load = async Script object
//
//
viewful.load = function (path, callback) {
  var view = new viewful.View();
  return view.load(path, callback);
}