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
    'renders expected result': function (err, result) {
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
      'throws an error': function (err, message) {
        assert.isObject(err);
        assert.equal(err.message, message);
      }
    };
  } else {
    return {
      topic: function (view) { return view; },
      'renders expected result': function (_view) {
        assert.equal(_view.render(data), expected);
      }
    };
  }
};

helpers.createEngineIntegrationBatch = function createEngineIntegrationBatch(engineMap, key, data) {
  var batch = {}
    , description = 'A new View({ input: "' + key + '" })'
    , engine = viewful.engines[key]
    , template = engineMap.template
    , expected = engineMap.expected
    , syncExpected = engineMap.syncRender ? expected : ''
    , pluginRequire = path.join(__dirname, '..', '..', 'lib', 'engines', key)
    ;
  batch[description] = {
    topic: function () {
      if (key !== 'html') {
        viewful.use(engine);
      }
      viewful.init();
      return viewful.createView({ 
          template: template
        , input: key
      });
    },
    'when rendering sync: View.render(data)': helpers.renderSync(data, syncExpected),
    'when rendering async: View.render(data, cb)': helpers.render(data, expected)
  };
  return batch;
};

helpers.renderUnit = function renderUnit(template, key, data, expected) {
  expected = expected || '';
  return {
    topic: function (result) {
      var plugin = result[key];
      plugin.render(template, data, this.callback);
    },
    'renders expected result': function (err, result) {
      assert.isNull(err);
      assert.equal(result, expected);
    }
  }
};

helpers.renderSyncUnit = function renderSyncUnit(template, key, data, expected) {
  expected = expected || '';
  if (expected === '') {
    return {
      topic: function (result) {
        var plugin = result[key]
          , msg = key + ' template engine cannot render synchronously';
        try { plugin.render(template, data); }
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
      return plugin.render(template, data); 
    }
    , 'renders expected result': function (html) {
      assert.equal(html, expected);
    }
  };
};

helpers.createEngineUnitBatch = function createEngineUnitBatch(engineMap, key, data) {
  var batch = {}
    , description = 'The ' + key + ' plugin'
    , expected = engineMap.expected
    , syncExpected = engineMap.syncRender ? expected : ''
    , template = engineMap.template
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
    }
    , 'when attached and initialized': {
      topic: function (plugin) {
        plugin.attach();
        plugin.init(function (err) { if (err) { console.log(err);} });
        return plugin;
      }
      , 'and rendering synchronously': helpers.renderSyncUnit(template, key, data, syncExpected)
      , 'and rendering asynchronously': helpers.renderUnit(template, key, data, expected)
    }
  };
  return batch;
};
