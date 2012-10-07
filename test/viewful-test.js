var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

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

  'a new viewful.View() with default options': {
    topic: viewful.factory(),
    'should return a new View': function (_view) {
      assert.isObject(_view);
    },
    'should contain "render" function': function (_view) {
      assert.isFunction(_view.render);
    },
    'should contain default "input"': function (_view) {
      assert.equal(_view.input, 'html');
    },
    'should contain default "output"': function (_view) {
      assert.equal(_view.output, "html");
    }
  }
}).export(module);
