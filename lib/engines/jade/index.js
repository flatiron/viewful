/**
 * Jade support.
 */

exports.jade = function(path, options, fn){
  var engine = requires.jade || (requires.jade = require('jade'));
  engine.renderFile(path, options, fn);
};

exports.attach = function (options) {
  var jade = require("jade");
  this.jade = {
    compile : function(template, data, cb){
      if (cb) {
        return cb(null, jade.compile(template)(data));
      }
      return jade.compile(template)(data);
    }
  }
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
};