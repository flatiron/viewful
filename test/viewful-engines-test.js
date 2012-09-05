var assert = require('assert')
  , vows = require('vows')
  , helpers = require('./helpers')
  , viewful = require('../lib/viewful')
  , mappings = require('./fixtures/engine-mappings')
  , data = mappings.data
  , engines = mappings.engines
  ;

vows.describe('viewful-engines-test')
  .addBatch(helpers.generateEngineTests(engines, data))
  .export(module);

