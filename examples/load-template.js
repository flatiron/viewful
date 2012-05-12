var viewful = require('../lib/viewful');

var view = new viewful.View();

var user = { name: 'tobi' };

//
// Async
//
view.load('./test/fixtures/views/simple/', function(err, html){
  if (err) {
    return console.log(err);
  }
  console.log('async', html);
});

//
// Sync
//
var html = view.load('./test/fixtures/views/simple/')
console.log('sync', html);
