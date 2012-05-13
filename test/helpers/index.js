var helpers = exports;

var assert = require('assert');

helpers.render = function (tmp, data, callback, expected) {

  expected = expected || '';

  return {
    topic: function(_view){
      this.callback(null, _view.render(tmp, data));
    },
    'should render expected result' : function (err, result) {
      assert.equal(result, expected);
    }
  }
}