/**
 * Eco Support
 */

var eco;

// Attempt to require eco template engine
try {
  eco = require("eco");
} catch (err) {
  console.warn('viewful.engines.eco requires the "eco" module from npm.');
  console.warn('install using "npm install eco".');
  console.trace();
  process.exit(1);
}

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
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
};
