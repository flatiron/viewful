/**
 * Swig Support
 */

var swig,
    opts;

exports.name = 'swig';

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

    render: function (template, data, cb) {
      var html;
      try {
        html = swig.compile(template)(data);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
  return this;
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
  // Attempt to require dependencies
  try {
    swig = require('swig');
    swig.init(opts);
    done();
  } catch (err) {
    done(err);
  }
};
