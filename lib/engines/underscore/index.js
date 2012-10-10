/**
 * Underscore Support
 */

var underscore;

exports.name = 'underscore';

exports.attach = function (options) {
  this.underscore = {
    render: function (template, data, cb) {
      var html, tmpl;
      try {
        tmpl = underscore.template(template, null, options);
        html = tmpl(data).replace(/\n$/, '');
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
  // Attempt to require dependencies
  try { 
    underscore = require('underscore');
    done();
  } catch (err) {
    done(err);
  }
};
