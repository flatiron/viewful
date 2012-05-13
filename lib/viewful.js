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

viewful.View = View;

function View (options) {

  this.templates = {};

  if (typeof options === "string") {
    this.load(options);
  }

  options     = options || {};
  this.input  = options.input || "jup";
  this.output = "html";
  return this;
}



exports.createRouter = function (options) {
  var view = new View(options);
  return view.createRouter();
}

View.prototype.createRouter = function() {
  var director = require('director');
  var router = new director.http.Router();
  this.templates.forEach(function(template){
    //
    // Bind a GET / to every template
    //
    router.get("/" + template, function (params) {
      var res = this.res;
      res.end(this.req.url);
    });
  });
  return router;
}

//
// Loads a template file or directory by path
//
View.prototype.load = function (/* filePath, cb */) {
  var args = utile.args(arguments);
  args.filePath = args.array[0];

  //
  // Is this a sync or async operation?
  //
  if (args.cb) {
    //
    // Async
    //
    path.exists(args.filePath, function(exists){
      if (!exists) {
        return args.cb(err);
      }
      //
      // Is this a directory or a file ?
      //
      fs.stat(args.filePath, function(err, stat) {
        if (err) {
          return args.cb(err);
        }
        if(stat.isDirectory()) {
          return fs.readdir(args.filePath, args.cb);
        } else {
          return fs.readFile(args.filePath, args.cb);
        }
      });
    });
  }

  //
  // Sync
  //
  if (path.existsSync(args.filePath)) {
    //
    // Is this a directory or a file ?
    //
    var stat = fs.statSync(args.filePath);
    if(stat.isDirectory()) {
      var dir = fs.readdirSync(args.filePath);
      this.templates = dir;
      return dir;
    } else {
      return fs.readFileSync(args.filePath);
    }
  } else {
    return null;
  }

}

View.prototype.render = function (/* tmpl, data, cb */) {

  var args = utile.args(arguments);
  args.tmpl  = args.array[0] || '';
  args.data  = args.array[1] || {};

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