var assert  = require('assert')
  , vows    = require('vows')
  , helpers = require('./helpers')
  , viewful = require('../lib/viewful')
  , View    = require('../lib/view')
  ;

vows.describe('viewful-test').addBatch({
  'viewful': {
    topic: viewful,
    'requires without error': function (result) {
      assert.ok(result);
    },
    'accepts plugins': function (_viewful) {
      assert.isFunction(_viewful.use);
      assert.isFunction(_viewful.init);
    },
    'contains an engines property': function (_viewful) {
      assert.includes(_viewful, 'engines');
    },
    'contains default html engine': function (_viewful) {
      assert.isObject(_viewful['html']);
      assert.isFunction(_viewful['html'].render);
    },
    'contains a createView() method': function (_viewful) {
      assert.isFunction(_viewful.createView);
    }
  },

  'viewful.engines': {
    topic: viewful.engines,
    'contains lazy-loaded engines': function (engines) {
      assert.isObject(engines);
      // TODO: Figure out a way to test/verify that viewful.engines
      // have been lazy-loaded. Use test setup/tear down?
      //console.log(engines);
      //assert.isFunction(engines.html);
      assert.isTrue(!!Object.getOwnPropertyDescriptor(engines, 'dot').get);
      assert.isTrue(!!Object.getOwnPropertyDescriptor(engines, 'whiskers').get);
    }
  },

  'viewful.createView(), with no options parameter': {
    topic: viewful.createView(),
    'returns a new view object': function (_view) {
      assert.isObject(_view);
      assert.instanceOf(_view, View);
    },
    'returns a view with an html input engine': function (_view) {
      assert.equal(_view.input, 'html');
    } 
  }
}).export(module);
