
var http        = require('http'),
    viewful     = require('../lib/viewful');


var viewfulRouter  = viewful.createRouter(__dirname + '/../test/fixtures/views/simple/');

//console.log(viewfulRouter)

var server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });
  
  //
  // TODO: Nested routers here is not right, should just be formfulRouter
  //       Director.mount seems to not want to work :-(
  //       Will investigate and fix. 
  //
  viewfulRouter.dispatch(req, res, function (err) {
    if (err) {
      res.writeHead(404);
      res.end();
    }
  });

});

server.listen(8000);
