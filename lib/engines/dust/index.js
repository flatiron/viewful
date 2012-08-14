/**
 * Dust Support
 */

exports.attach = function (options) {
 var dust;
 try {
  dust = require('dust');
 } catch (err) {
  dust = require('dustjs-linkedin');
 }
 this.dust = {
  render: function (view, data, cb) {
    try {
      dust.compileFn(view.template)(data, cb);
    } catch (err) {
      if (cb) { cb(err); }
      else { throw err; }
    }
  }
 };
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
};
