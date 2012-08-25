var viewful = require('../../lib/viewful');

var view = new viewful.View({
  path: "./examples/views/jade/creature",
  input: "jade"
});

view.load();

// Remark: You could just as easily use an async view.create.render call here too
//
console.log(view.create.render({ user: { email: "foo@bar.com", name: "bob" }}));
