var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

vows.describe('viewful/viewful-load-test').addBatch({
  'When using `viewful`': {
    'a new viewful.View()': {
      topic: new viewful.View(),
      'should return a new View': function (_view) {  
        assert.isObject(_view);
      },
      'should contain "load" function': function (_view) {
        assert.isFunction(_view.load);
      },
      'should contain default "input"': function (_view) {
        assert.equal("jup", _view.input);
      },
      'should contain default "output"': function (_view) {
        assert.equal("html", _view.output);
      },
      'viewful.load()' : {
        topic : function(_view){
          try {
            var loaded = _view.load();
            this.callback(null, loaded);
          } catch (err) {
            this.callback(err);
          }
        },
        'should return error' : function(err, loaded){
          assert.isNull(err);
        }
      },
      'viewful.load("/invalid/path/to")' : {
        topic : function(_view){
          var loaded = _view.load("/invalid/path/to");
          this.callback(loaded);
        },
        'should error' : function(result){
          assert.isNotNull(result)
        }
      },
      'viewful.load("./test/fixtures/views/simple/")' : {
        topic : function(_view){
          try {
            var loaded = _view.load("./test/fixtures/views/simple/");
            this.callback(null, loaded);
          } catch (err) {
            this.callback(err);
          }
        },
        'should not error' : function(err, result){
          assert.isNull(err)
        },
        'should return loaded templates' : function(err, result){
          assert.isObject(result)
        },
        'and templates should be valid' : function(err, result){
          assert.isObject(result['./test/fixtures/views/simple/'])
          assert.isDefined(result['./test/fixtures/views/simple/'].templates['index.html']);
          assert.isDefined(result['./test/fixtures/views/simple/'].templates['foo.html']);
          assert.isDefined(result['./test/fixtures/views/simple/'].templates['bar.html']);
        }
      },
      'viewful.load("./test/fixtures/views/simple/", cb)' : {
        topic : function(_view){
          _view.load("./test/fixtures/views/simple/", this.callback);
        },
        'should not error' : function(err, result){
          assert.isNull(err)
        },
        'should return loaded templates' : function(err, result){
          assert.isObject(result)
        },
        'and templates should be valid' : function(err, result){
          assert.isObject(result['./test/fixtures/views/simple/'])
          assert.isDefined(result['./test/fixtures/views/simple/'].templates['index.html']);
          assert.isDefined(result['./test/fixtures/views/simple/'].templates['foo.html']);
          assert.isDefined(result['./test/fixtures/views/simple/'].templates['bar.html']);
        }
      }
    }
  }
}).export(module);

