/**
 * Plates Support
 */

var plates
  , cheerio
  ;

exports.attach = function (options) {
  this.plates = {
    render : function (view, data, cb) {
      //
      // Remark: Layout code should probably be abstracted out to plates
      //
      var layout = cheerio.load(view['layout'])
        , hasPresenter = typeof view.present == 'function'
        , html
        ;
      //TODO: Remove when presenter tests are passing
      /*
      view.present = function (data, cb) { 
        if (cb) {
          return cb(null, JSON.stringfy(data));
        } 
        return JSON.stringify(data);
      };
      */
      if (hasPresenter && cb) {
        view.present(data, function (err, result) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          layout('body').html(result);
          return cb(null, layout.html())
        })
      } else if(hasPresenter) {
        layout('body').html(view.present(data));
        return layout.html();
      } else {
        try {
          html = plates.bind(view.template, data);
        } catch (err) {
          if (cb) { return cb(err); }
          throw err;
        }
        if (cb) { return cb(null, html); }
        return html;
      }
    }
  };
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
  try {
    cheerio = require('cheerio');
    plates = require('plates');
    done();
  } catch (err) {
    done(err);
  }
};
