/**
 * Jazz Support
 */

exports.attach = function (options) {
  var jazz = require('jazz');
  this.jazz = {
    render: function (view, data, cb) {
      var tmpl;
      try {
        tmpl = jazz.compile(view.template, options);
        tmpl.eval(data, function (str) { cb(null, str); });
      } catch (err) {
        return cb(err);
      }
    }
  };
};

// 'exports.init' gets called by broadway on app.init()'
exports.init = function (done) {
};
