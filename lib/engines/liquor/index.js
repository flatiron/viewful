/**
 * Liquor Support
 */

var liquor;

exports.name = 'liquor';

exports.attach = function (options) {
  this.liquor = {
    render: function (template, data, cb) {
      var html;
      try {
        html = liquor.compile(template, options)(data);
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
  // Attempt to require the liquor template engine
  try {
    liquor = require('liquor');
    done();
  } catch (err) {
    done(err);
  }
};
