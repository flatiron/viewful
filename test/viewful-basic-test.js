var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

vows.describe('viewful').addBatch({
  'When using `viewful`': {
    'the viewful api': {
      topic: viewful,
      'should require without error': function (result) {
        assert(true, true);
      },
      topic: viewful,
      'should contain a top-level render method': function (_viewful) {
        assert.isFunction(_viewful.render);
      },
      'should contain a top-level View class': function (_viewful) {
        assert.isFunction(_viewful.View);
      },
      'should contain engines': function (_viewful) {
        assert.isObject(_viewful.engines);
      },
      'should have loaded JUP engine': function (_viewful) {
        assert.isObject(_viewful.engines['jup']);
        assert.isFunction(_viewful.engines['jup'].compile);
      },
      'should be able to create a new View instance': function (_viewful) {
        assert.isObject(new _viewful.View());
      }
    },
    'a new viewful.View() with default options': {
      topic: new viewful.View(),
      'should return a new View': function (_view) {
        assert.isObject(_view);
      },
      'should contain "render" function': function (_view) {
        assert.isFunction(_view.render);
      },
      'should contain default "input"': function (_view) {
        assert.equal("jup", _view.input);
      },
      'should contain default "output"': function (_view) {
        assert.equal("html", _view.output);
      },
      'and calling View.render()':                 helpers.render(),
      'and calling View.render(["p", user.name])': helpers.render(["p", "marak"], null, null, "<p>marak</p>"),
    }
  }
}).export(module);

