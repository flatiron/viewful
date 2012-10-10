/**
 * QEJS Support
 */

var qejs;

exports.name = 'qejs';

exports.attach = function (options) {
  this.qejs = {
    render: function (template, data, cb) {
      if (typeof cb === 'undefined') {
        throw new Error('qejs template engine cannot render synchronously');
      }
      qejs.render(template, data).then(function (str) {
        cb(null, str);
      }, function (err) {
        cb(err)
      }).end();
    }
  };
  return this;
};

// 'exports.init' gets called by broadway on 'app.init()'
exports.init = function (done) {
  // Attempt to require dependencies
  try {
    qejs = require('qejs');
    done();
  } catch (err) {
    done(err);
  }
};
