var helpers = exports;

var assert = require('assert');

helpers.compile = function (tmp, data, callback, expected) {

  expected = expected || '';

  return {
    topic: function(_view){
      this.callback(null, _view.compile(tmp, data));
    },
    'should compile expected result' : function (err, result) {
      assert.equal(result, expected);
    }
  }
}