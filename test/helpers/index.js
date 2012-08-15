var helpers = exports;
var assert = require('assert');

helpers.render = function (data, expected) {
  expected = expected || '';
  return {
    topic: function (_view) {
      _view.render(data, this.callback);
    },
    'should compile expected result': function (err, result) {
      assert.isNull(err);
      assert.equal(result, expected);
    }
  }
};

helpers.renderSync = function (data, expected) {
  expected = expected || '';
  return {
    topic: function (view) { return view; },
    'should compile expected result': function (_view) {
      assert.equal(_view.render(data), expected);
    }
  }
};
