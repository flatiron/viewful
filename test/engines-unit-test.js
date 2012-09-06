var assert = require('assert')
  , vows = require('vows')
  , helpers = require('./helpers')
  , mappings = require('./fixtures/engine-mappings')
  , data = mappings.data
  , engines = mappings.engines
  ;

var suite = vows.describe('engines-unit-test');

Object.keys(engines).forEach(function (key) {
  suite.addBatch(helpers.generateEngineUnitBatch(engines[key], key, data));
});

suite.export(module);
