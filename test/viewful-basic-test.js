var assert = require('assert'),
    vows = require('vows'),
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
      'and calling View.render()': {
        topic: function(_view){
          this.callback(null, _view.render());
        },
        'should return an empty template' : function (err, result) {
          assert.equal(result, "");
        }
      },
      'and calling View.render(["p", user.name])': {
        topic: function(_view){
          var user = { name: "marak" };
          this.callback(null, _view.render(["p", user.name]));
        },
        'should render the template' : function (err, result) {
          assert.equal(result, "<p>marak</p>");
        }
      }
    }
  }
}).export(module);

