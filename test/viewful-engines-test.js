var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

var user = { user : { name: "tobi" }};

vows.describe('viewful-engines-test').addBatch({
  'When using `viewful`': {
    'a new viewful.View({ input: "jade" })': {
      topic: new viewful.View({ input: "jade" }),
      'should return a new View': function (_view) {  
        assert.isObject(_view);
      },
      'should contain "compile" function': function (_view) {
        assert.isFunction(_view.compile);
      },
      'should contain default "input"': function (_view) {
        assert.equal("jade", _view.input);
      },
      'should contain default "output"': function (_view) {
        assert.equal("html", _view.output);
      },
      'and calling View.compile()'                       : helpers.compile(undefined, null, null, ""),
      'and calling View.compile("p= user.name")'         : helpers.compile('p= "tobi"', null, null, "<p>tobi</p>"),
      'and calling View.compile("p= user.name", user })' : helpers.compile('p= user.name', user, null, "<p>tobi</p>")
    }
  }
}).export(module);

