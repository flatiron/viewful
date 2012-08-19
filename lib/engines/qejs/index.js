/**
 * QEJS Support
 */

exports.attach = function (options) {
  var qejs = require('qejs');
  this.qejs = {
    render: function (view, data, cb) {
      qejs.render(view.template, data).then(function (str) {
        cb(null, str);
      }, function (err) {
        cb(err)
      }).end();
    }
  };
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
};
