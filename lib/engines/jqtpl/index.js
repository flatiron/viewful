/**
 * JQTPL Support
 */

var jqtpl;

exports.name = 'jqtpl';

exports.attach = function (options) {
  this.jqtpl = {
    render: function (template, data, cb) {
      var html;
      try {
        html = jqtpl.tmpl(template, data, options);
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

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
  // Attempt to require the jqtpl template engine
  try {
    jqtpl = require('jqtpl');
    done();
  } catch (err) {
    done(err);
  }
};
