var viewful = require('../lib/viewful');

var view = new viewful.View();

var user = { name: 'tobi' };

//
// Async
//
view.render(["p", user.name], function(err, html){
  if (err) {
    return console.log(err);
  }
  console.log('async', html);
});

//
// Sync
//
var html = view.render(["p", user.name])
console.log('sync', html);
