/**
 * Dust Support
 */

var dust;

exports.attach = function (options) {
  this.dust = {
    render: function (view, data, cb) {
      try {
        dust.compileFn(view.template)(data, cb);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
  try {
    dust = require('dust');
    done();
  } catch (err) {
    try {
      dust = require('dustjs-linkedin');
      done();
    } catch (err) {
      done(err);
    }
  }
};
