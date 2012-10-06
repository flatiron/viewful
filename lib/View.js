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
    //
    // TODO: cleanup and move $.load
    //
    //
    // Remark: If we have been passed in a template as a string, the querySelectorAll context needs to be updated
    //
    if(typeof self.$.load === 'function') {
      self.$ = self.$.load(self.template)
    }
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

  if (options.inputEngine) {
    self.inputEngine = options.inputEngine;
  }

  if (options.outputEngine) {
    self.outputEngine = options.outputEngine;
  }

  this.input = options.input || 'html';
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

  //
  // TODO: remove *nix separator and replace with something more
  // OS independent, search through all viewful files/libs/plugins
  // and verify file paths are OS agnostic.
  //
  self.templatePath  = self.viewPath + '/';
  self.presenterPath = self.viewPath + '/';

  //
  // Is this a sync or async operation?
  // TODO: abstract loading out to a ViewLoader object, this would
  // improve test coverage and allow for smaller methods, and better
  // readability.
  //
  if (cb) {
    return self._loadAsync(cb);
  } else {
    return self._loadSync();
  }
}


View.prototype.render = function (data, callback) {
  var self = this;

  //
  // TODO: Improve `loadEnv` / move it to View.detectQuerySelector
  //
  function loadEnv(result) {
    if(typeof self.$.load === 'function') {
      self.$ = self.$.load(result)
    }
  }

  if (callback) {
    return self.inputEngine.render(self, data, function(err, result){
      self.rendered = result;
      loadEnv(self.rendered);
      callback(err, result);
    });
  }

  // TODO: add optional output rendering, if selected
  self.rendered = self.inputEngine.render(self, data);
  loadEnv(self.rendered);
  return self.rendered;
};

View.prototype._loadSync = function () {
  var self = this;

  if (!fs.existsSync(self.viewPath)) {
    throw new Error( 'invalid path ' + self.viewPath)
  }

  var root = self.viewPath;
  var dir = fs.readdirSync(root);

  dir.forEach(function(p){
    var stat = fs.statSync(root + '/' + p);
    if (stat.isDirectory()){
      delegate('dir', p);
    } else {
      delegate('file', p);
    }
  });

  function delegate (type, _path){
    var ext = self.detect(_path),
        input,
        subViewName;
    subViewName = _path.replace(ext, '');
    if(type === "file") {
      //
      // load the file as the current template
      //
      result = fs.readFileSync(root + '/' + _path).toString();

      var presenter, template;
      //
      // determine if file is View template or View Presenter
      //
      if (ext === ".js") {
        //
        // Remark: Don't create subviews for ".js" files, as they are Presenters, not template files
        //
      } else {
        template = result;
        presenter = function () {};
        try {
          var _present = root +  '/' + _path.replace(ext, '');
          presenter = require(_present);
        } catch(ex) {
          // TODO: sorry
          // console.log(_present, ex);
        }
        //
        // presenter, attempt to load
        //
        self[subViewName] = new View({
          template: template,
          input: self.input,
          present: presenter
        });
      }
    }

    if(type === "dir") {
      //
      // create a new subview
      //
      self[subViewName] = new View({
        path: root + '/' + _path,
        input: self.input
      });
      //
      // load view
      //
      self[subViewName].load();
    }
  }
  return self;
};

View.prototype._loadAsync = function (cb) {

  var self = this,
  viewPath = self.viewPath,
  callbacks = 0;

  var root = self.viewPath;

  fs.readdir(root, function(err, dir) {
    if (err) {
      return cb(err);
    }
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

  function delegate (type, _path){
    var ext = self.detect(_path),
        input,
        subViewName;
    subViewName = _path.replace(ext, '');

    if(type === "file") {
      //
      // increase the callback count
      //
      callbacks ++;

      var lastPresenter = function(){};

      // determine if file is template or presenter ( presenters end in .js and are node modules )
      if (ext === ".js") {
        callbacks--;
        lastPresenter = require(process.cwd() + '/' + root + '/' + _path);
      } else {

        //
        // load the file as the current template
        //
        fs.readFile(root + '/' + _path, function(err, result) {
          result = result.toString();
          var presenter, template;
          //
          // determine if file is template or presenter
          //
          template = result;
          //
          // presenter, attempt to load
          //
          self[subViewName] = new View({
            template: template,
            input: self.input,
            present: lastPresenter
          });

          callbacks--;
          if(callbacks === 0){
            cb(null, self);
          }
        });
      }

    }

    if(type === "dir") {
      //
      // create a new subview
      //
      self[subViewName] = new View({
        path: root + '/' + _path,
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

/* TODO: Remove this unless we will need async loading for start
viewful.engines.init(function (err) {
  if (err) {
    console.log(err);
  }
});
*/

View.detectQuerySelector = function () {
  //
  // TODO: Add better feature detection here for $
  //

  var cheerio;
  try {
   cheerio = require('cheerio');
  } catch (err) {
    // Do nothing
  }

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
