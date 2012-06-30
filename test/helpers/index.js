var helpers = exports;
var assert = require('assert');

helpers.render = function (data, expected) {
  expected = expected || '';
  return {
    topic: function(_view){
      this.callback(null, _view.render(data));
    },
    'should compile expected result' : function (err, result) {
      assert.equal(result, expected);
    }
  }
}