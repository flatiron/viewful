var assert = require('assert')
  , vows = require('vows')
  , dot = require('../lib/engines/dot/index')
  , mappings = require('./fixtures/engine-mappings')
  , engines = mappings.engines
  , data = mappings.data
  ;

vows.describe('doT template engine plugin').addBatch({
  'The plugin': {
    topic: dot
    , 'should contain an attach() method': function (plugin) {
      assert.isFunction(plugin.attach);
    }
    , 'should contain an init() method': function (plugin) {
      assert.isFunction(plugin.init);
    }
    , 'when attached': {
      topic: function (plugin) {
        plugin.attach();
        return plugin;
      }
      , 'should contain a "dot" property of type Object': function (plugin) {
        assert.isObject(plugin.dot);
      }
      , 'should contain a "dot" property with a render() method': function (plugin) {
        assert.isFunction(plugin.dot.render);
      }
    }
    , 'when attached and initialized': {
      topic: function (plugin) {
        plugin.attach();
        plugin.init(function (err) { if (err) console.dir(err);  });
        return plugin;
      }
      , 'and rendering sync': {
        topic: function (plugin) {
          var mockView = { template: engines.dot.template };
          return plugin.dot.render(mockView, data);
        }
        , 'should compile expected result': function (html) {
          assert.equal(html, engines.dot.expected);
        }
      }
    }
  }
}).export(module);
