var assert = require('assert')
  , vows = require('vows')
  , helpers = require('./helpers')
  , viewful = require('../lib/viewful')
  , mappings = require('./fixtures/engine-mappings')
  , data = mappings.data
  , engines = mappings.engines
  ;

vows.describe('engines-integration-test')
  .addBatch(helpers.generateRenderTests(engines, data))
  .export(module);

