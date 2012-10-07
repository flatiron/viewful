var helpers = exports
  , assert = require('assert')
  , path = require('path')
  , viewful = require('../../lib/viewful')
  ;

helpers.render = function render(data, expected) {
  expected = expected || '';
  return {
    topic: function (_view) {
      _view.render(data, this.callback);
    },
    'should compile expected result': function (err, result) {
      assert.isNull(err);
      assert.equal(result, expected);
    }
  }
};

helpers.renderSync = function renderSync(data, expected) {
  expected = expected || '';
  if (expected === '') {
    return {
      topic: function (_view) {
        var msg = _view.input
                + ' template engine cannot render synchronously';
        try{ _view.render(data); }
        catch (err) { this.callback(err, msg); }
      },
      'should error': function (err, message) {
        assert.isObject(err);
        assert.equal(err.message, message);
      }
    };
  } else {
    return {
      topic: function (view) { return view; },
      'should compile expected result': function (_view) {
        assert.equal(_view.render(data), expected);
      }
    };
  }
};

helpers.generateRenderTests = function generateRenderTests(engines, data) {
  var batch = {};
  Object.keys(engines).forEach(function (key) {
    var description = 'A new View({ input: "' + key + '" })'
      , expected = engines[key].expected
      , syncExpected = engines[key].syncRender ? expected : ''
      , engineRequire = engines[key].engineRequire || key
      , pluginRequire = path.join(__dirname, '..', '..', 'lib', 'engines', key)
      ;
    batch[description] = {
      topic: function () {
        var engine, enginePlugin;
        if (key !== 'html') {
          engine = require(engineRequire);
          enginePlugin = require(pluginRequire);
          viewful.engines.use(enginePlugin, { engine: engine });
          viewful.engines.init();
        }
        return viewful.factory({ 
            template: engines[key].template
          , input: key
        });
      },
      'when rendering sync: View.render(data)': helpers.renderSync(data, syncExpected),
      'when rendering async: View.render(data, cb)': helpers.render(data, expected)
    };
  });
  return batch;
};

helpers.renderUnit = function renderUnit(mockView, data, expected) {
  expected = expected || '';
  return {
    topic: function (engine) {
      engine.render(mockView, data, this.callback);
    },
    'should compile expected result': function (err, result) {
      assert.isNull(err);
      assert.equal(result, expected);
    }
  }
};

helpers.renderSyncUnit = function renderSyncUnit(mockView, data, expected) {
  expected = expected || '';
  if (expected === '') {
    return {
      topic: function (engine) {
        var msg = mockView.input
                + ' template engine cannot render synchronously';
        try { engine.render(mockView, data); }
        catch (err) { this.callback(err, msg); }
      }
      , 'should error': function (err, message) {
        assert.isObject(err);
        assert.equal(err.message, message);
      }
    };
  }
  return {
    topic: function (engine) { return engine.render(mockView, data); }
    , 'should compile expected result': function (html) {
      assert.equal(html, expected);
    }
  };
};

helpers.generateEngineUnitBatch = function generateEngineUnitBatch(engineMap, key, data) {
  var batch = {}
    , description = 'The ' + key + ' plugin'
    , expected = engineMap.expected
    , syncExpected = engineMap.syncRender ? expected : ''
    , mockView = { template: engineMap.template
                 , input: key
                 }
    ;
  batch[description] = {
    topic: require('../../lib/engines/' + key + '/index')
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
      , 'should contain an object of the same name': function (plugin) {
        assert.isObject(plugin[key]);
      }
      , 'should contain an object of the same name with a render() method': function (plugin) {
        assert.isFunction(plugin[key].render);
      }
    }
    , 'when attached and initialized': {
      topic: function (plugin) {
        plugin.attach();
        plugin.init(function (err) { if (err) console.dir(err); });
        return plugin[key];
      }
      , 'and rendering sync': helpers.renderSyncUnit(mockView, data, syncExpected)
      , 'and rendering async': helpers.renderUnit(mockView, data, expected)
    }
  };
  return batch;
};
