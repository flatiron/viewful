/**
 * doT Support
 */

var dot;

exports.name = 'dot';

exports.attach = function (options) {
  this.dot = {
    render: function (template, data, cb) {
      var html;
      try {
        html = dot.template(template)(data);
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
  // Attempt to require dot template engine
  try {
    dot = require('dot');
    done();
  } catch (err) {
    done(err);
  }
};
