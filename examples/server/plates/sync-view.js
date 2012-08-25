var viewful = require('../../lib/viewful');

var view = new viewful.View({
  path: "./examples/views/swig",
  input: "swig"
});

view.load();

// Remark: You could just as easily use an async view.create.render call here too
//
console.log(view)
console.log(view.creature.inputs.button.render({ label: "cool"}));
