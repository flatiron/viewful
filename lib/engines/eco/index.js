/**
 * Eco Support
 */

exports.attach = function (options) {
  var eco = require("eco");
  this.eco = {
    render: function (view, data, cb) {
      var html;
      try {
        html = eco.render(view.template, data);
      } catch (err) {
        if (cb) { return cb(err); }
        else { throw err; }
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
};
