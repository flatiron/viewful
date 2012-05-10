var assert = require('assert'),
    vows = require('vows'),
    viewful = require('../lib/viewful');

vows.describe('viewful').addBatch({
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
      'and calling View.render()': {
        topic: function(_view){
          this.callback(null, _view.render());
        },
        'should return <undefined></undefined>' : function (err, result) {
          assert.equal(result, "<undefined></undefined>");
        }
      },
      'and calling View.render("p= user.name")': {
        topic: function(_view){
          this.callback(null, _view.render('p= "tobi"'));
        },
        'should render the template' : function (err, result) {
          assert.equal(result, "<p>tobi</p>");
        }
      },
      'and calling View.render("p= user.name", { user: { name: "tobi" }})': {
        topic: function(_view){
          var user = { user : { name: "tobi" }};
          this.callback(null, _view.render("p= user.name", user));
        },
        'should render the template' : function (err, result) {
          assert.equal(result, "<p>tobi</p>");
        }
      }
    }
  }
}).export(module);

