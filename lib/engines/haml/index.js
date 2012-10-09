/**
 * Haml Support
 */

var haml;

exports.name = 'haml';

exports.attach = function (options) {
  this.haml = {
    render: function (view, data, cb) {
      var html;
      options = options || {};
      options.locals = data;
      try {
        html = haml.render(view.template, options).trimLeft();
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html
    } 
  };
  return this;
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
  // Attempt to require the haml template engine
  try {
    haml = require('haml');
    done();
  } catch (err) {
    done(err);
  }
};
