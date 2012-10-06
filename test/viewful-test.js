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
    'should contain a factory() method': function (_viewful) {
      assert.isFunction(_viewful.factory);
    },
    'should contain engines': function (_viewful) {
      assert.isObject(_viewful.engines);
    },
    'should have loaded plates engine': function (_viewful) {
      assert.isObject(_viewful.engines['plates']);
      assert.isFunction(_viewful.engines['plates'].render);
    },
    'should be able to create a new View instance': function (_viewful) {
      assert.isObject(_viewful.factory());
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
