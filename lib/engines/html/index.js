exports.name = 'html';

exports.attach = function (options) {
  this.html = {
    render : function (view, data, cb) {
      if (cb) {
        return cb(null, view.template);
      } else {
        return view.template;
      }
    }
  };
  return this;
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
};
