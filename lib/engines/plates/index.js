exports.attach = function (options) {
  //var JUP = require("plates").JUP
  this.plates = {
    render : function (input, data, cb) {
      //
      // As a special-case, JUP can parse either JSON or stringified JSON
      //
      if(typeof input === "string") {
        try {
          input = JSON.parse(input);
        } catch (err) {
          console.log('warn: refusing invalid input to JUP');
          input = [];
        }
      }
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