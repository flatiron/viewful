exports.name = 'html';

exports.attach = function (options) {
  this.html = {
    render : function (template, data, cb) {
      if (cb) {
        return cb(null, template);
      } else {
        return template;
      }
    }
  };
  return this;
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
};
