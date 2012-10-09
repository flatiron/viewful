/**
 * Jade support.
 */

var jade;

exports.name = 'jade';

exports.attach = function (options) {
  this.jade = {
    render: function (view, data, cb) {
      var html;
      try {
        html = jade.compile(view.template, options)(data);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  }
  return this;
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
  // Attempt to require the jade template engine
  try {
    jade = require('jade');
    done();
  } catch (err) {
    done(err);
  }
};
