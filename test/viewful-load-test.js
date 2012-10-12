var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

vows.describe('viewful/viewful-load-test').addBatch({
  'When using `viewful`': {
    'calling viewful.createView()': {
      topic: viewful.createView(),
      'returns a new View': function (_view) {  
        assert.isObject(_view);
      },
      'contains "load" function': function (_view) {
        assert.isFunction(_view.load);
      },
      'contains default "input"': function (_view) {
        assert.equal(_view.input, 'html');
      },
      'contains default "output"': function (_view) {
        assert.equal(_view.output, "html");
      },
      'viewful.load("/invalid/path/to")' : {
        topic : function(_view){
          var loaded = _view.load("/invalid/path/to");
          this.callback(loaded);
        },
        'throws an error' : function(result){
          assert.isNotNull(result)
        }
      },
      'viewful.load("./examples/fixtures/swig/view/")' : {
        topic : function(_view){
          try {
            var loaded = _view.load("./examples/swig/view/");
            this.callback(null, loaded);
          } catch (err) {
            this.callback(err);
          }
        },
        'does not error' : function(err, result){
          assert.isNull(err)
        },
        'returns loaded templates' : function(err, result){
          assert.isObject(result)
        },
        'returns valid templates' : function(err, result){
          assert.isObject(result)
          assert.isDefined(result.creature.create.template);
          assert.isDefined(result.creature.create.render);
          assert.isDefined(result.creature.create.present);
          assert.isDefined(result.creature.inputs.button.template);
          assert.isDefined(result.creature.inputs.button.render);
          assert.isDefined(result.creature.inputs.button.present);
        }
      },
      'viewful.load("./test/fixtures/views/simple/", cb)' : {
        topic : function(_view){
          _view.load("./test/fixtures/views/simple/", this.callback);
        },
        'does not error' : function(err, result){
          assert.isNull(err)
        },
        'returns loaded templates' : function(err, result){
          assert.isObject(result)
        },
        'returns valid templates' : function(err, result){
          assert.isObject(result)
          assert.isDefined(result.index.template);
          assert.isDefined(result.bar.template);
          assert.isDefined(result.foo.template);
          assert.isDefined(result.bar.render);
          assert.isDefined(result.foo.render);
          assert.isDefined(result.bar.present);
        }
      }
    }
  }
}).export(module);
