exports.attach = function (options) {
  this.html = {
    render : function (view, data, cb) {
      //
      // Remark: Layout code should probably be abstracted out somewhere
      //
      var layout = view.$.load(view['layout']);
      if (cb) {
        view.render(data, function (err, result) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          layout('body').html(result);
          return cb(null, layout.html())
        })
      } else {
        layout('body').html(view.template);
        return layout.html();
      }
    }
  }
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
};