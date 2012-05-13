exports.attach = function (options) {
  var JUP = require("jup").JUP
  this.jup = {
    compile : function (input, data, cb) {
      if (cb) {
        try {
          input = JUP.html(input);
          return cb(null, input)
        } catch (err) {
          return cb(err);
        }
      }
      return JUP.html(input);
    }
  }
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
};