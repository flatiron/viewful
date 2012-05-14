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

viewful.View = View;

function View (options) {

  this.templates = {};
  this.cheerio  = cheerio;

  if (typeof options === "string") {
    this.load(options);
  }

  options = options || {};

  if (options.template) {
    this.load(options.template);
  }

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
  var self = this;
  //
  // Create a new route handler for every view
  //
  Object.keys(self.templates).forEach(function(template){
    //
    // Bind a GET / to every template
    //
    Object.keys(self.templates[template]).forEach(function(file){

      // too many bindings...
      router.get('/', routeHandler);
      router.get("/" + file, routeHandler);

      function routeHandler () {
        var res = this.res;
        var view = this.req.url.replace('/','');
        //
        // If "/" was requested
        //
        if(view === "") {
          //
          // TODO: index.<engine>
          //
          view = "index.html";
        }
        res.end(self.render(view, template));
      }

    })
  });
  return router;
}

View.prototype.render = function (view, template, cb) {

  var self = this,
  engine = self.detect(view);
  engine = engine || 'html';

  var r = self.templates[template][view];
  //
  // check for layout file
  //
  if (self.templates[template]['layout.html']) {
    var $ = cheerio.load(self.templates[template]['layout.html']);
    $('body').html(r)
    return $.html();
  }

  return r;
};


//
// Loads a template file or directory by path
//
// Can work sync or async depending on if a callback is provided
//
//
View.prototype.load = function (/* filePath, cb */) {
  var args = utile.args(arguments);
  args.filePath = args.array[0];

  var self = this;

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
          fs.readdir(args.filePath, function(err, dir) {
            if (err) {
              return args.cb(err);
            }
            var i = 0;
            self.templates[args.filePath] = {};
            dir = dir.filter(function(item){ return item !== ".DS_Store"; });
            dir.forEach(function(p){
              fs.readFile(args.filePath + './' + p, function(err, result) {
                i++;
                self.templates[args.filePath][p] = result.toString();
                if(i === dir.length) {
                  args.cb(null, self.templates);
                }
              });
            })
          });
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
      dir = dir.filter(function(item){ return item !== ".DS_Store"; });
      this.templates[args.filePath] = {};
      for(var p in dir) {
        this.templates[args.filePath][dir[p]] = fs.readFileSync(args.filePath + './' + dir[p]).toString();
      }
      return this.templates;
    } else {
      this.templates[args.filePath] = fs.readFileSync(args.filePath).toString();
      return fs.readFileSync(args.filePath);
    }
  } else {
    return null;
  }

}



//
// TODO: Detects view type based on current path
//
View.prototype.detect = function (path) {
  var ext = path.substr(path.indexOf('.') + 1, path.length);
  return ext;
}

View.prototype.compile = function (/* tmpl, data, cb */) {

  var args = utile.args(arguments);
  args.tmpl  = args.array[0] || '';
  args.data  = args.array[1] || {};

  if (args.cb) {
    viewful.engines[this.input].compile(args.tmpl, args.data, args.cb);
  }

  return viewful.engines[this.input].compile(args.tmpl, args.data);
}

viewful.compile  = function (/* str, data, cb */) {
  
  /* TODO: Finish viewful.compile helper method
  var args = utile.args(arguments),
      str  = '';
  var view = new View();
  if (args.cb) {
    return view.compile(args.str, args.data, args.cb);
  }
  return view.compile(args.str, args.data);
  */
};

/* TODO: Remove this unless we will need async loading for start
viewful.engines.init(function (err) {
  if (err) {
    console.log(err);
  }
});

*/