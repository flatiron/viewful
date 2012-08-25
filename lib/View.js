
//
// TODO: cheerio shouldnt be required in this file
//
var cheerio  = require('cheerio');

var viewful = require('./viewful');

var path = require('path'),
    fs = require('fs');

var View = function (options) {

  var self = this;

  options = options || {};
  self.$ = View.detectQuerySelector();

  self.viewPath = options.path || process.cwd();

  if (options.path) {
    self.viewPath      = options.path
    self.templatePath  = self.viewPath + '/';
    self.presenterPath = self.viewPath + '/';
  }


  if (options.template) {
    self.template = options.template;
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


  if(typeof options.input !== 'undefined'){
    this.input  = options.input;
  }

  this.output = "html";

  return this;
}

//
// Loads a template file or directory by path
// Can work sync or async depending on if a callback is provided
//
View.prototype.load = function (viewPath, cb) {
  var self = this;

  //
  // TODO: better currying of args
  //
  if(typeof cb !== 'function' && typeof viewPath === 'function') {
    cb = viewPath;
  }

  if(typeof viewPath === "string") {
    self.viewPath = viewPath;
  }

  self.templatePath  = self.viewPath + '/';
  self.presenterPath = self.viewPath + '/';
  //
  // Is this a sync or async operation?
  //
  if (cb) {
    return self._loadAsync(cb);
  } else {
    return self._loadSync();
  }
}


View.prototype.render = function (data, callback) {
  var self = this;
  
  var inputEngine  = viewful.engines[self.input],
      outputEngine = viewful.engines[self.output];
  
  //
  // TODO: Improve `loadEnv` / move it to View.detectQuerySelector
  //
  function loadEnv(result) {
    if(typeof self.$.load === 'function') {
      self.$ = self.$.load(result)
    }
  }
  if (callback) {
    return inputEngine.render(self, data, function(err, result){
      self.rendered = result;
      loadEnv(self.rendered);
      callback(err, result);
    });
  }
  self.rendered = inputEngine.render(self, data);
  loadEnv(self.rendered);
  return self.rendered;
};

View.prototype._loadSync = function () {
  var self = this;
  if (fs.existsSync(self.viewPath)) {
    var stat = fs.statSync(self.templatePath);
    if(stat.isDirectory()) {
      var dir = fs.readdirSync(self.templatePath);
      dir = dir.filter(function(item){
        var ext = self.detect(item);
        if(ext === '.js') {
          return false;
        }
        return item !== ".DS_Store";
      });
      for(var p in dir) {
        var ext = self.detect(dir[p]);
        var subView = dir[p].replace(ext, '');
        var presenter, layout;
        var resolvedPath = path.resolve(self.templatePath + subView);
        try {
          presenter  = require(resolvedPath);
        } catch(err) {
          console.error(err)
          //
          // TODO: Better warnings for not be able to load presenters
          //
          console.log('Could not load presenter for ' + resolvedPath);
          //
          // Remark: noop out the method for now
          //
          presenter = function () {};
        }
        /*
          TODO: determine where to move this layout logic
        */
        try {
          layout  = fs.readFileSync(self.templatePath + '/layout' + ext).toString();
        } catch(err) {
          console.log('Could not load layout for ' + dir[p], err);
          layout = '';
        }

        //
        // Remark: Create options for sub-view
        //
        var o = {};
        o.template = fs.readFileSync(self.templatePath + '/' + dir[p]).toString();
        o.present = presenter;
        o.layout = layout;
        //
        // Sub-view input engine should be auto-detected based on file name
        //
        o.input = ext.replace('.', '');
        o.output = self.output;
        self[subView] = new View(o);
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

View.prototype._loadAsync = function (cb) {

  var self = this,
  viewPath = self.viewPath,
  callbacks = 0;

  var root = self.viewPath;

  fs.readdir(root, function(err, dir) {
    dir.forEach(function(p){
      fs.stat(root + '/' + p, function(err, stat){
        if (stat.isDirectory()){
          delegate('dir', p);
        } else {
          delegate('file', p);
        }
      });
    });
   });

  function delegate (type, path){
    var ext = self.detect(path),
        input,
        subViewName;
    subViewName = path.replace(ext, '');

    if(type === "file") {
      //
      // increase the callback count
      //
      callbacks ++;
      var lastPresenter = function(){};
      //
      // load the file as the current template
      //
      fs.readFile(root + '/' + path, function(err, result) {
        result = result.toString();
        var presenter, template;
        //
        // determine if file is template or presenter
        //
        if (ext === ".js") {
          lastPresenter = eval(result); // TODO: sorry
        } else {
          template = result;
          //
          // presenter, attempt to load
          //
          self[subViewName] = new View({
            template: template,
            input: self.input,
            present: lastPresenter
          });
        }
        callbacks--;
        if(callbacks === 0){
          cb(null, self);
        }
      });
    }

    if(type === "dir") {
      //
      // create a new subview
      //
      self[subViewName] = new View({
        path: root + '/' + path,
        input: self.input
      });
      //
      // increase callback count
      //
      callbacks ++;
      //
      // load view
      //
      self[subViewName].load(function(){
        //
        // decrease callback count
        //
        callbacks--;
        if(callbacks === 0){
          cb(null, self);
        }
      });
    }
  }
  return;

};


//
// TODO: Detects view type based on current path
//
View.prototype.detect = function (p) {
  return path.extname(p);
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


View.prototype.extendRouter = function (router, options) {
  var self = this;
  //
  // Create a new route handler for every view
  //
  //
  // TODO: replace with traverse, right now its 1 level deep
  //
  for(var p in self) {
    if(self[p] instanceof View){
      //
      // Bind a GET / to every template
      //
      router.get("/" + p, routeHandler);

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
        //
        // TODO: merge in req data
        //
        var data = { user: { name: "marak"}};
        res.end(self[view].render(data));
      }
    }
  }
  return router;
};

View.prototype.createRouter = function() {
  var director = require('director');
  var router = new director.http.Router();
  this.extendRouter(router, {});
  return router;
}

View.detectQuerySelector = function () {
  //
  // TODO: Add feature detection here for $
  //

  //
  // Detected server-side node.js, use cheerio
  //
  if(typeof cheerio !== 'undefined') {
    return cheerio;
  }

  return function(){};

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

module['exports'] = View;