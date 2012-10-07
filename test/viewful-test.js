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
      assert.isObject(_viewful.engines['html']);
      assert.isFunction(_viewful.engines['html'].render);
    },
    'should contain a factory() method': function (_viewful) {
      assert.isFunction(_viewful.factory);
    }
  },

  'viewful.engines': {
    topic: viewful.engines,
    'should accept plugins': function (engines) {
      assert.isObject(engines);
      assert.isFunction(engines.use);
      assert.isFunction(engines.init);
    }
  },

  'viewful.factory(), with no options parameter': {
    topic: viewful.factory(),
    'should return a new view object': function (_view) {
      assert.isObject(_view);
      assert.instanceOf(_view, View);
    },
    'should return a view with an html input engine': function (_view) {
      assert.equal(_view.input, 'html');
    }
  }
}).export(module);
