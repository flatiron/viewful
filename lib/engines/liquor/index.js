/**
 * Liquor Support
 */

exports.attach = function attach(options) {
  var liquor = require('liquor');
  this.liquor = {
    render: function render(view, data, cb) {
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
exports.init = function init(done) {
};
