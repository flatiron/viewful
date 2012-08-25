var viewful = require('../../../lib/viewful');

var view = new viewful.View({
  path: "./examples/views/swig",
  input: "swig"
});

view.load(function(err, result){
  if(err) {
    return console.log(err);
  }

  //
  // Remark: You could just as easily use a sync view.create.render call here too
  //
  view.creature.inputs.button.render({ label: 'fudge'}, function(err, result){
    console.log(result)
  });
  view.creature.create({ label: 'fudge'}, function(err, result){
    console.log(result)
  });
  
});
