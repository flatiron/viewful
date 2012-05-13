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
      'should contain "render" function': function (_view) {
        assert.isFunction(_view.render);
      },
      'should contain default "input"': function (_view) {
        assert.equal("jade", _view.input);
      },
      'should contain default "output"': function (_view) {
        assert.equal("html", _view.output);
      },
      'and calling View.render()'                       : helpers.render(undefined, null, null, ""),
      'and calling View.render("p= user.name")'         : helpers.render('p= "tobi"', null, null, "<p>tobi</p>"),
      'and calling View.render("p= user.name", user })' : helpers.render('p= user.name', user, null, "<p>tobi</p>")
    }
  }
}).export(module);

