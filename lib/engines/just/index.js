/**
 * Just Support
 */

var Just;

exports.name = 'just';

exports.attach = function (options) {
  options = options || {};
  this.just = {
    render: function (template, data, cb) {
      var engine;
      if (typeof cb === 'undefined') {
        throw new Error('just template engine cannot render synchronously');
      }
      options.root = {};
      options.root.page = template;
      engine = new Just(options);
      try {
        engine.render('page', data, cb);
      } catch (err) {
        cb(err);
      }        
    }
  };
  return this;
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
  // Attempt to require the Just template engine
  try {
    Just = require ('just');
  } catch (err) {
    return done(err);
  }
  return done();
};
