/**
 * Swig Support
 */

var swig,
    opts;

exports.attach = function (options) {
  opts = options || {};
  this.swig = {

    //
    // Swig supports an optional swig.init method for configuring the engine
    // see: https://github.com/paularmstrong/swig/blob/master/docs/getting-started.md#init
    //
    init: function(options) {
      return swig.init(options);
    },

    render: function (view, data, cb) {
      var html;
      try {
        html = swig.compile(view.template)(data);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
  try {
    swig = require('swig');
    swig.init(opts);
    done();
  } catch (err) {
    done(err);
  }
};
