var assert = require('assert')
  , vows = require('vows')
  , viewful = require('../lib/viewful')
  ;

vows.describe('viewful/viewful-present-test').addBatch({
  'A new, complex viewful.View(), containing a "button" template,': {
    topic: new viewful.View({
        input: 'swig'
      , path: './test/fixtures/views/swig/creature'
    })
    , 'when loaded': {
      topic: function (view) {
        view.load();
        return view;
      }
      , 'should contain a button object': function (view) {
        assert.isObject(view.inputs.button);
      }
      , 'should contain a present() method': function (view) {
        assert.isFunction(view.inputs.button.present);
      }
    }
  }
}).export(module);
