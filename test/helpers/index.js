var helpers = exports
  , assert = require('assert')
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

helpers.generateEngineTests = function generateEngineTests(engines, data) {
  var batch = {};
  Object.keys(engines).forEach(function (key) {
    var description = 'A new viewful.View({ input: "' + key + '" })'
      , expected = engines[key].expected
      , syncExpected = engines[key].syncRender ? expected : ''
      ;
    batch[description] = {
      topic: function () {
        viewful.engines.init();      
        return new viewful.View({ 
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

helpers.generateEngineUnitTests = function generateEngineUnitTests(engines, data) {
  var batch = {};
  Object.keys(engines).forEach(function (key) {
    var description = 'The ' + key + ' plugin'
      , expected = engines[key].expected
      , syncExpected = engines[key].syncRender ? expected : ''
      ;
    batch[description] = {
      topic: require('../../lib/engines/' + key + '/index')
      , 'should contain an attach() method': function (plugin) {
        assert.isFunction(plugin.attach);
      }
    };
  });
  return batch;
};
