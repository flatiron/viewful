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

  this.views = {};

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
// Can work sync or async depending on if a callback is provided
//
View.prototype.load = function (viewPath, cb) {
  var self = this,
      templatePath  = viewPath + '/template/',
      presenterPath = viewPath + '/presenter/';
  //
  // Is this a sync or async operation?
  //
  if (cb) {
    return self._loadAsync(viewPath, cb);
  } else {
    return self._loadSync(viewPath);
  }
}

View.prototype._loadSync = function (viewPath) {

  var self = this,
      templatePath  = viewPath + '/template',
      presenterPath = viewPath + '/presenter';

  if (path.existsSync(viewPath)) {
    var stat = fs.statSync(templatePath);
    if(stat.isDirectory()) {
      var dir = fs.readdirSync(templatePath);
      dir = dir.filter(function(item){ return item !== ".DS_Store"; });
      this.views[viewPath] = {}
      this.views[viewPath].templates = {};
      this.views[viewPath].presenters = {};
      for(var p in dir) {
        this.views[viewPath].templates[dir[p]] = fs.readFileSync(templatePath + '/' + dir[p]).toString();
        try {
          this.views[viewPath].presenters[dir[p]]  = require(path.normalize(process.cwd() + '/' + presenterPath + '/' + dir[p].replace('.html', '')));
          // this.views[filePath].presenters[dir[p]].prototype.cheerio = "boob";
        } catch(err) {
          console.log(err);
        }
      }
      return this.views;
    } else {
      this.views[filePath].templates = fs.readFileSync(templatePath).toString();
      return fs.readFileSync(filePath);
    }
  } else {
    return null;
  }
};

View.prototype._loadAsync = function (viewPath, cb) {

  if(typeof viewPath === 'undefined') {
    callback(new Error('no path'), null);
  }

  var self = this,
      templatePath  = viewPath + '/template',
      presenterPath = viewPath + '/presenter';

  path.exists(templatePath, function(exists){
    if (!exists) {
      return cb('No file path ' + viewPath);
    }
    fs.stat(templatePath, function(err, stat) {
      if (err) {
        return cb(err);
      }
      if(stat.isDirectory()) {
        fs.readdir(templatePath, function(err, dir) {
          if (err) {
            return cb(err);
          }
          var i = 0;
          self.views[viewPath] = {}
          self.views[viewPath].templates = {};
          self.views[viewPath].presenters = {};

          dir = dir.filter(function(item){ return item !== ".DS_Store"; });
          dir.forEach(function(p){
            //
            // TODO: Don't use normal require() here, use lazy getters since this is suppose to be async!
            //
            try {
              self.views[viewPath].presenters[p] = require(path.normalize(__dirname + '../../' + presenterPath + '/' + p.replace('.html', '')));
            } catch(err) {
              console.log(err);
            }
            //self.views[filePath].presenters[p].cheerio = "boob";
            fs.readFile(templatePath + '/' + p, function(err, result) {
              if(err) { throw err }
              i++;
              self.views[viewPath].templates[p] = result.toString();
              if(i === dir.length) {
                cb(null, self.views);
              }
            });
          })
        });
      } else {
        //
        // Remark: The path passed in was a file, not a directory.
        // Load the file.
        //
        return fs.readFile(templatePath, cb);
      }
    });
  });
};


//
// TODO: Detects view type based on current path
//
View.prototype.detect = function (path) {
  var ext = path.substr(path.indexOf('.') + 1, path.length);
  return ext;
}

View.prototype.compile = function (tmpl, data, cb) {
  if (cb) {
    viewful.engines[this.input].compile(tmpl, data, cb);
  }
  return viewful.engines[this.input].compile(tmpl, data);
}

viewful.compile  = function (/* str, data, cb */) {
  
  /* TODO: Finish viewful.compile helper method
  var args = utile.args(arguments),
      str  = '';
  var view = new View();
  if (cb) {
    return view.compile(args.str, args.data, cb);
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