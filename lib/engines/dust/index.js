/**
 * Dust Support
 */

var dust;

exports.name = 'dust';

exports.attach = function (options) {
  this.dust = {
    render: function (template, data, cb) {
      // Remark: Dust cannot render synchonously, it can however return a
      // stream object if dust.renderSource(source, context, [cb]) is called
      // with no callback, that is currently not implemented in this plugin.
      if (typeof cb === 'undefined') { 
        throw new Error('dust template engine cannot render synchronously');
      }
      try {
        dust.compileFn(template)(data, cb);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
    }
  };
  return this;
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
  // Attempt to require dust template engine
  try {
    dust = require('dust');
  } catch (err) {
    try {
      dust = require('dustjs-linkedin');
    } catch (err) {
      return done(err);
    }
  }
  return done();
};
