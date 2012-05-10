var viewful = exports;

var utile    = require('utile'),
    fs       = require('fs'),
    broadway = require("broadway"),
    plugins  = fs.readdirSync(__dirname + '/engines');

viewful.engines = new broadway.App();

plugins.forEach(function(item){
  viewful.engines.use(require("./engines/" + item), { "delimiter": "!" } );
});

viewful.View = View;

function View (options) {
  options     = options || {};
  this.input  = options.input || "jup";
  this.output = "html"
  return this;
}

View.prototype.render = function (/* tmpl, data, cb */) {
  var args = utile.args(arguments);
  args.data  = args.data || {};
  if (args.cb) {
    viewful.engines[this.input].compile(args.tmpl, args.data, args.cb);
  }
  return viewful.engines[this.input].compile(args.tmpl, args.data);
}

//
// TODO: Detects view type based on current path
//
View.prototype.detect = function (path) {
  return '/where/it/at.html';
}

viewful.render  = function (/* str, data, cb */) {
  
  /* TODO: Finish viewful.render helper method
  var args = utile.args(arguments),
      str  = '';
  var view = new View();
  if (args.cb) {
    return view.render(args.str, args.data, args.cb);
  }
  return view.render(args.str, args.data);
  */
};

/* TODO: Remove this unless we will need async loading for start
viewful.engines.init(function (err) {
  if (err) {
    console.log(err);
  }
});

*/