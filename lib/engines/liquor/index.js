/**
 * Liquor Support
 */

exports.attach = function (options) {
  var liquor = require('liquor');
  this.liquor = {
    render: function (view, data, cb) {
      var html;
      try {
        html = liquor.compile(view.template, options)(data);
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
