var path     = require('path')
  , fs       = require('fs')
  , broadway = require('broadway')
  , htmlEngine = require('./engines/html')
  // TODO: rename file from 'View.js' to 'view.js'
  // and refactor require statement to match
  , View     = require('./View')
  , viewful
  ;

// Allow viewful and viewful.engines to be extended with user-defined
// plugins.
viewful = new broadway.App();
viewful.engines = new broadway.App();

// Attach default html rendering engine
viewful.engines.use(htmlEngine, {});

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
  if ((input && !viewful.engines[input]) || !input) {
    options.inputEngine = viewful.engines['html'];
  }
  if (input && viewful.engines[input]) {
    options.inputEngine = viewful.engines[input];
  }
  if (output && viewful.engines[output]) {
    options.outputEngine = viewful.engines[output];
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
