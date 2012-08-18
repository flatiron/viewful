var viewful = require('../lib/viewful');

var view = new viewful.View({
  path: "./examples/jade/creature"
});

view.load();

console.log(view.create);
