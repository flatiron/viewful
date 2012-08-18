var viewful = require('../lib/viewful');

var view = new viewful.View({
  path: "./examples/creature",
  input: "jade",
  output: "html"
});

view.load();

view['create.jade'].render({ user: { email: "foo@bar.com", name: "bob" } }, function(err, result){
  console.log(err, result)
})

