var assert = require('assert')
  , vows = require('vows')
  , helpers = require('./helpers')
  , mappings = require('./fixtures/engine-mappings')
  , data = mappings.data
  , engines = mappings.engines
  ;

vows.describe('engines-unit-test')
  .addBatch(helpers.generateEngineUnitTests(engines, data))
  .export(module);
