/**
 * Just Support
 */

exports.attach = function (options) {
  var Just = require ('just'),
  options = options || {};
  this.just = {
    render: function (view, data, cb) {
      var engine;
      options.root = {};
      options.root.page = view.template;
      engine = new Just(options);
      try {
        engine.render('page', data, cb);
      } catch (err) {
        cb(err);
      }        
    }
  };
};
