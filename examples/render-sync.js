var viewful = require('../lib/viewful');

var view = new viewful.View({
  path: "./examples/creature",
  input: "jade",
  output: "html"
});

view.load();

console.log(view['create.jade'].render({ user: { email: "foo@bar.com", name: "bob" } }));