var viewful = require('../lib/viewful');

var view = new viewful.View({
  path: "./examples/jade/creature"
});

view.load();

view.create.render({ user: { email: "foo@bar.com", name: "bob" } }, function(err, result){
  console.log(err, result)
});
