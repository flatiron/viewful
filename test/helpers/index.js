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

helpers.generateEngineTests = function generateEngineTests(engines, data, expected) {
  var context = {};
  Object.keys(engines).forEach(function (key) {
    var description = 'a new viewful.View({ input: "' + key + '" })'
      , syncExpected = engines[key].syncRender ? expected : ''
      ;
    context[description] = {
      topic: function () {
        viewful.engines.init();      
        return new viewful.View({ 
            template: engines[key].template
          , input: key
        });
      },
      'and calling View.render(user)': helpers.renderSync(data, syncExpected),
      'and calling View.render(user, cb)': helpers.render(data, expected)
    };
  });
  return context;
};
