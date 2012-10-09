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
      , pluginRequire = path.join(__dirname, '..', '..', 'lib', 'engines', key)
      ;
    batch[description] = {
      topic: function () {
        if (key !== 'html') {
          viewful.use(viewful.engines[key]);
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

helpers.renderUnit = function renderUnit(mockView, key, data, expected) {
  expected = expected || '';
  return {
    topic: function (result) {
      var plugin = result[key];
      plugin.render(mockView, data, this.callback);
    },
    'renders expected result': function (err, result) {
      assert.isNull(err);
      assert.equal(result, expected);
    }
  }
};

helpers.renderSyncUnit = function renderSyncUnit(mockView, key, data, expected) {
  expected = expected || '';
  if (expected === '') {
    return {
      topic: function (result) {
        var plugin = result[key]
          , msg = mockView.input
                + ' template engine cannot render synchronously';
        try { plugin.render(mockView, data); }
        catch (err) { this.callback(err, msg); }
      }
      , 'throws an error': function (err, message) {
        assert.isObject(err);
        assert.equal(err.message, message);
      }
    };
  }
  return {
    topic: function (result) { 
      var plugin = result[key];
      return plugin.render(mockView, data); 
    }
    , 'renders expected result': function (html) {
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
    , 'contains an attach() method': function (plugin) {
      assert.isFunction(plugin.attach);
    }
    , 'contains an init() method': function (plugin) {
      assert.isFunction(plugin.init);
    }
    , 'when attached': {
      topic: function (plugin) {
        return plugin.attach();
      }
      , 'returns an object containing the plugin object': function (result) {
        assert.isObject(result[key]);
      }
      , 'the plugin object contains a render method': function (result) {
        assert.isFunction(result[key].render);
      }
      , 'and rendering synchronously': helpers.renderSyncUnit(mockView, key, data, syncExpected)
      , 'and rendering asynchronously': helpers.renderUnit(mockView, key, data, expected)
    }
  };
  return batch;
};
