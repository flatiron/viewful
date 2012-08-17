/**
 * Underscore Support
 */

exports.attach = function (options) {
  var underscore = require('underscore');
  this.underscore = {
    render: function (view, data, cb) {
      var html, tmpl;
      try {
        tmpl = underscore.template(view.template, null, options);
        html = tmpl(data).replace(/\n$/, '');
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};
