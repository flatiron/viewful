var path       = require('path')
  , fs         = require('fs')
  , broadway   = require('broadway')
  , View       = require('./view')
  , enginesDir = path.join(__dirname, 'engines')
  , viewful
  ;

// Allow viewful to be extended with user-defined plugins.
viewful = new broadway.App();

// Lazy load all template engine plugins in the "engines" dir
viewful.engines = broadway.common.requireDirLazy(enginesDir);

// Attach default html rendering engine
viewful.use(viewful.engines.html);

// Create the new view using a Factory pattern
viewful.factory = function factory(options) {
  var input, output;

  // initialize variables for faster lookup and less typing
  options = options || {};
  input = options.input;
  output = options.output;

  // Gracefully fall back to default html rendering engine if the desired
  // input engine plugin is unavailable or hasn't been attached correctly,
  // OR, if no input option has been given.
  if ((input && !viewful[input]) || !input) {
    options.inputEngine = viewful['html'];
  }
  if (input && viewful[input]) {
    options.inputEngine = viewful[input];
  }
  if (output && viewful[output]) {
    options.outputEngine = viewful[output];
  }
  return new View(options);
};

//
// Remark:
//
//    Server-Side Load = fs module
//    Client-Side Load = async Script object
//
viewful.load = function (path, callback) {
  var view = viewful.factory();
  return view.load(path, callback);
}

// Export the 'viewful' module
module.exports = viewful;
