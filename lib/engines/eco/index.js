/**
 * Eco Support
 */

var eco;

exports.name = 'eco';

exports.attach = function (options) {
  this.eco = {
    render: function (view, data, cb) {
      var html;
      try {
        html = eco.render(view.template, data);
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
  // Attempt to require eco template engine
  try {
    eco = require("eco");
    done();
  } catch (err) {
    done(err);
  }
};
