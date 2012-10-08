/**
 * Ejs Support
 */

var ejs;

// Attempt to require ejs template engine
try {
  ejs = require('ejs');
} catch (err) {
  console.warn('viewful.engines.ejs requires the "ejs" module from npm.');
  console.warn('install using "npm install ejs".');
  console.trace();
  process.exit(1);
}

exports.name = 'ejs';

exports.attach = function (options) {
  this.ejs = {
    render: function (view, data, cb) {
      var html;
      try {
        html = ejs.compile(view.template, options)(data);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'.
exports.init = function (done) {
};
