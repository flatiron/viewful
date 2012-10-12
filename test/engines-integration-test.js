var assert = require('assert')
  , vows = require('vows')
  , helpers = require('./helpers')
  , mappings = require('./fixtures/engine-mappings')
  , data = mappings.data
  , engines = mappings.engines
  ;

Object.keys(engines).forEach(function (key) {
  var description = 'engines-integration-test::' + key;
  exports[key] = vows.describe(description)
    .addBatch(helpers.createEngineIntegrationBatch(engines[key], key, data))
    .addBatch(helpers.teardown(key));
});
