var assert  = require('assert')
  , vows    = require('vows')
  , helpers = require('./helpers')
  , viewful = require('../lib/viewful')
  , View    = require('../lib/view')
  ;

vows.describe('viewful-test').addBatch({
  'viewful': {
    topic: viewful,
    'should require without error': function (result) {
      assert.ok(result);
    },
    'should accept plugins': function (_viewful) {
      assert.isFunction(_viewful.use);
      assert.isFunction(_viewful.init);
    },
    'should contain an engines property': function (_viewful) {
      assert.includes(_viewful, 'engines');
    },
    'should contain default html engine': function (_viewful) {
      assert.isObject(_viewful['html']);
      assert.isFunction(_viewful['html'].render);
    },
    'should contain a createView() method': function (_viewful) {
      assert.isFunction(_viewful.createView);
    }
  },

  'viewful.engines': {
    topic: viewful.engines,
    'should contain lazy-loaded engines': function (engines) {
      assert.isObject(engines);
      // TODO: Figure out a way to test/verify that viewful.engines
      // have been lazy-loaded. Use test setup/tear down?
      //console.log(engines);
      assert.isFunction(engines.html);
      assert.equal(typeof engines.html, 'Getter');
    }
  },

  'viewful.createView(), with no options parameter': {
    topic: viewful.createView(),
    'should return a new view object': function (_view) {
      assert.isObject(_view);
      assert.instanceOf(_view, View);
    },
    'should return a view with an html input engine': function (_view) {
      assert.equal(_view.input, 'html');
    }
  }
}).export(module);
