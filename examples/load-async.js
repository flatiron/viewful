var viewful = require('../lib/viewful');

var view = new viewful.View({
  path: "./examples/creature",
  input: "jade",
  output: "html"
});

/* TODO
view.load(function(err, result){
  console.log(view['create.jade']);
});
*/
