var viewful = exports;

var utile    = require('utile'),
    path     = require('path'),
    fs       = require('fs'),
    cheerio  = require('cheerio'),
    broadway = require("broadway"),
    plugins  = fs.readdirSync(__dirname + '/engines');

viewful.engines = new broadway.App();

plugins.forEach(function(item){
  viewful.engines.use(require("./engines/" + item), { "delimiter": "!" } );
});

viewful.View = require('./View');

viewful.load = function (path, callback) {
  var view = new viewful.View();
  return view.load(path, callback);
}
viewful.createRouter = function (options) {
  var view = new View(options);
  return view.createRouter();
}
