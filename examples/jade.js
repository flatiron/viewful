var viewful = require('../lib/viewful');

var view = new viewful.View({ input: "jade" });

var user = { user: { name: 'tobi' }};

//
// Async
//
view.compile("p= user.name", user, function(err, html){
  if (err) {
    return console.log(err);
  }
  console.log('async', html);
});

//
// Sync
//
var html = view.compile("p= user.name", user)
console.log('sync', html);
