/**
 * Swig Support
 */

exports.attach = function (options) {
  var swig = require('swig');
  swig.init(options);
  this.swig = {
    render: function (view, data, cb) {
      var html;
      try{
        html = swig.compile(view.template)(data);
      } catch (err) {
        if (cb) { cb(err); }
        else { throw err; }
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
};
