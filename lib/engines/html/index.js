exports.attach = function (options) {
  
  var self = this;
  
  this.html = {
    compile : function (input, data, cb) {
      if (cb) {
        try {
          input = input;
          return cb(null, input)
        } catch (err) {
          return cb(err);
        }
      }
      return input;
    },
    
    render: function (path, data, cb) {
      
      var cheerio = require('cheerio');
      
      console.log(self.templates);
      
      console.log(path, data)
      
      return 'compiled';
      
    }
    
    
    
  }
  
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {
};