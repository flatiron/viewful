/**
 * JQTPL Support
 */

exports.attach = function (options) {
  var jqtpl = require('jqtpl');
  this.jqtpl = {
    render: function (view, data, cb) {
      var html;
      try {
        html = jqtpl.tmpl(view.template, data, options);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
};
