/**
 * Haml-Coffee Support
 */

var hamlCoffee;

exports.name = 'haml-coffee';

exports.attach = function (options) {
  this['haml-coffee'] = {
    render: function (view, data, cb) {
      var html;
      try {
        html = hamlCoffee.compile(view.template, options)(data);
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
  // Attempt to require the haml-coffee template engine
  try {
    hamlCoffee = require('haml-coffee');
    done();
  } catch (err) {
    done(err);
  }
};
