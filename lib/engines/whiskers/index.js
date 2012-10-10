/**
 * Whiskers Support
 */

var whiskers;

exports.name = 'whiskers';

exports.attach = function (options) {
  this.whiskers = {
    render: function (view, data, cb) {
      var html;
      try {
        html = whiskers.render(view.template, data);
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
    whiskers = require('whiskers');
    done();
  } catch (err) {
    done(err);
  }
};
