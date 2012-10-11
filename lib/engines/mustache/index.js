/**
 * Mustache Support
 */

var mustache;

exports.name = 'mustache';

exports.attach = function (options) {
  this.mustache = {
    render: function (template, data, cb) {
      var html;
      try {
        html = mustache.to_html(template, data);
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
  // Attempt to require the mustache template engine
  try {
    mustache = require('mustache');
  } catch (err) {
    return done(err);
  }
  return done();
};
