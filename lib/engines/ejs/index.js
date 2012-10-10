/**
 * Ejs Support
 */

var ejs;

exports.name = 'ejs';

exports.attach = function (options) {
  this.ejs = {
    render: function (template, data, cb) {
      var html;
      try {
        html = ejs.compile(template, options)(data);
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

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
  // Attempt to require ejs template engine
  try {
    ejs = require('ejs');
    done();
  } catch (err) {
    done(err);
  }
};
