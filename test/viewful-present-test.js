var assert = require('assert')
  , vows = require('vows')
  , viewful = require('../lib/viewful')
  // TODO: Remove or refactor expected variable after Marak's review. The
  // "expected" variable is used for testing the present() method, see 
  // additional TODO note below for more info on testing of present() method.
  //, expected = '<div><button id="thebutton">Show Alert</button></div>'
  ;

vows.describe('viewful/viewful-present-test').addBatch({
  'A new, complex view, containing a "button" template,': {
    topic: viewful.factory({
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
    /* TODO: Refactor or remove after Marak's review. Not sure how to test
     * the present() method. I think it needs to be tested client-side, using
     * a headless browser testing environment like zombie.js, or equivalent..
     *
    , 'when loaded and rendered synchronously': {
      topic: function (view) {
        var results;
        view.load();
        view.render({ label: 'Show Alert' });
        results = view.button.present();
        return results;
      }
      , 'should return expected results when calling present()': function (results) {
        assert.equal(results, expected);
      }
    }
    */
  }
}).export(module);
