var viewful = require('../../lib/viewful');

var view = new viewful.View({
  path: "./examples/swig/view",
  input: "swig"
});

view.load();

// Remark: You could just as easily use an async view.create.render call here too
//
console.log(view.creature.create.render({ user: { name: "bob", email: "bob@marak.com" }}));
console.log(view.creature.inputs.button.render({ label: "cool"}));
