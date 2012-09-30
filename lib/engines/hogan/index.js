/**
 * Hogan Support
 */

var hogan;

exports.attach = function (options) {
  this.hogan = {
    render: function (view, data, cb) {
      var html;
      try {
        html = hogan.compile(view.template, options).render(data);
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
  // TODO: refactor to remove require('hogan.js') when v3.0.0 is released
  try {
    hogan = require('hogan.js');
    done();
  } catch (err) {
    try {
      // Remark: Temporary fix to include unreleased v3.0.0
      hogan = require('hogan');
      done();
    } catch (err) {
      done(err);
    }
  }
};
