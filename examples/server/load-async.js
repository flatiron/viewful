var viewful = require('../../lib/viewful');

var view = new viewful.View({
  path: "./examples/views/jade/creature",
  input: "jade"
});

view.load(function(err, result){
  if(err) {
    return console.log(err);
  }
  console.log(view.create.render({ user: { email: "foo@bar.com", name: "bob" }}));
});
