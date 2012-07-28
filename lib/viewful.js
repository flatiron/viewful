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

  var self = this;

  options = options || {};

  self.$ = self.detectQuerySelector();

  self.viewPath = options.path || process.cwd();

  if (options.path) {
    self.viewPath      = options.path
    self.templatePath  = self.viewPath + '/';
    self.presenterPath = self.viewPath + '/';
  }


  if (options.template) {
    self.template = options.template;
    self.$ = cheerio.load(self.template);
  }

  if (options.present) {
    self.present = options.present;
  }

  if (options.render) {
    self.render = options.render;
  }

  if (options.layout) {
    self.layout = options.layout;
  }

  if (typeof options === "string") {
    this.load(options);
  }


  this.input  = options.input || "plates";
  this.output = "html";

  return this;
}

viewful.load = function (path, callback) {
  var view = new viewful.View();
  return view.load(path, callback);
}

//
// Loads a template file or directory by path
// Can work sync or async depending on if a callback is provided
//
View.prototype.load = function (viewPath, cb) {
  var self = this;
  self.viewPath      = (viewPath);
  self.templatePath  = self.viewPath + '/';
  self.presenterPath = self.viewPath + '/';
  //
  // Is this a sync or async operation?
  //
  if (cb) {
    return self._loadAsync(viewPath, cb);
  } else {
    return self._loadSync(viewPath);
  }
}


View.prototype.render = function (data, callback) {
  var self = this;
  
  var inputEngine  = viewful.engines[self.input],
      outputEngine = viewful.engines[self.output];
  
  if (callback) {
    return inputEngine.render(self, data, callback);
  }

  return inputEngine.render(self, data);
  /*
  //
  // check for layout file
  //
  if (self.templates[template]['layout.html']) {
    var $ = cheerio.load(self.templates[template]['layout.html']);
    $('body').html(r)
    return $.html();
  }
  */
  return r;
};

View.prototype._loadSync = function () {
  var self = this;
  if (path.existsSync(self.viewPath)) {
    var stat = fs.statSync(self.templatePath);
    if(stat.isDirectory()) {
      var dir = fs.readdirSync(self.templatePath);
      dir = dir.filter(function(item){ return item !== ".DS_Store"; });
      for(var p in dir) {

        var subView = dir[p].replace('.html', ''); // TODO: Replace with file extension
        var presenter, layout;

        try {
          presenter  = require(path.normalize(self.presenterPath + '/' + subView));
        } catch(err) {
          console.log('Could not load presenter for ' + dir[p], err);
          presenter = function () {};
        }

        try {
          layout  = fs.readFileSync(self.templatePath + '/layout.html').toString();
        } catch(err) {
          console.log('Could not load layout for ' + dir[p], err);
          layout = '';
        }

        self[subView] = new View({ 
          template: fs.readFileSync(self.templatePath + '/' + dir[p]).toString(),
          present: presenter,
          layout: layout
        });
      }
      return self;
    } else {
      self.template = fs.readFileSync(self.templatePath).toString();
      return self;
    }
  } else {
    throw new Error('Doesnt exist ' + self.viewPath);
    return null;
  }
};

View.prototype._loadAsync = function (viewPath, cb) {

  if(typeof viewPath === 'undefined') {
    callback(new Error('no path'), null);
  }

  var self = this;

  path.exists(self.templatePath, function(exists){
    if (!exists) {
      return cb('No file path ' + viewPath);
    }
    fs.stat(self.templatePath, function(err, stat) {
      if (err) {
        return cb(err);
      }
      if(stat.isDirectory()) {
        fs.readdir(self.templatePath, function(err, dir) {
          if (err) {
            return cb(err);
          }
          var i = 0;
          dir = dir.filter(function(item){ return item !== ".DS_Store"; });
          dir.forEach(function(p){
            var subView = p.replace('.html', '');
            fs.readFile(self.templatePath + '/' + p, function(err, result) {
              i++;
              if(err) { console.log(err); }
              else {
                var presenter;
                try {
                  presenter  = require(path.normalize(process.cwd() + '/' + self.presenterPath + '/' + subView));
                } catch(err) {
                  presenter = function () {};
                }
                self[subView] = new View({ 
                  template: result.toString(),
                  present: presenter
                });
                if(i === dir.length) {
                  cb(null, self);
                }
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

/*
View.prototype.compile = function (tmpl, data, cb) {
  if (cb) {
    viewful.engines[this.input].compile(tmpl, data, cb);
  }
  return viewful.engines[this.input].compile(tmpl, data);
}
*/

/* TODO: Remove this unless we will need async loading for start
viewful.engines.init(function (err) {
  if (err) {
    console.log(err);
  }
});
*/

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

View.prototype.detectQuerySelector = function () {
  //
  // TODO: Add feature detection here for $
  //

  //
  // Detected server-side node.js, use cheerio
  //
  return cheerio;

  //
  // Detected client-side jQuery, use jQuery
  //
  // TODO

  //
  // Detected client-side querySelectorAll, using querySelectorAll
  //
  // TODO

  //
  // Client-side, but no $ found. Using Zepto fallback
  //
  // TODO
};
