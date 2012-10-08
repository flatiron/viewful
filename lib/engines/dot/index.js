/**
 * doT Support
 */

var dot = require('dot');

exports.name = 'dot';

exports.attach = function (options) {
  this.dot = {
    render: function (view, data, cb) {
      var html;
      try {
        html = dot.template(view.template)(data);
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
};
