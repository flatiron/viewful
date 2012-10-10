/**
 * Plates Support
 */

var plates
  , cheerio
  ;

exports.name = 'plates';

exports.attach = function (options) {
  this.plates = {
    render : function (template, data, cb) {
      var html;
      try {
        html = plates.bind(template, data);
      } catch (err) {
        if (cb) { return cb(err); }
        throw err;
      }
      if (cb) { return cb(null, html); }
      return html;
      //
      // Remark: Layout code should probably be abstracted out to plates
      // TODO: Maybe move this to a present() method in this plugin
      //
      //var layout = cheerio.load(view['layout'])
      //  , hasPresenter = typeof view.present == 'function'
      //  , html
      //  ;
      // TODO: Remove when presenter tests are passing
      // TODO: Maybe move this to a present() method in this plugin
      /*
      view.present = function (data, cb) { 
        if (cb) {
          return cb(null, JSON.stringfy(data));
        } 
        return JSON.stringify(data);
      };
      */
      // TODO: Maybe move this to a present() method in this plugin
      /*
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
      */
    }
  };
  return this;
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
  // Attempt to require dependencies
  try {
    cheerio = require('cheerio');
    plates = require('plates');
    done();
  } catch (err) {
    done(err);
  }
};
