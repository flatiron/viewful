var viewful = require('../../lib/viewful');

var view = new viewful.View({
  path: "./examples/views/jade/creature",
  input: "jade"
});

view.load(function(err, result){
  if(err) {
    return console.log(err);
  }

  //
  // Remark: You could just as easily use a sync view.create.render call here too
  //
  view.create.render({ user: { email: "foo@bar.com", name: "bob" }}, function(err, result){
    console.log(err, result);
  });
});
