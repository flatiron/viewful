var assert = require('assert')
  , vows = require('vows')
  , helpers = require('./helpers')
  , viewful = require('../lib/viewful')
  ;

var user = { user : { name: "tobi" } }
  , expected = '<p>tobi</p>'
  , engines = {
      'dot': { template: '<p>{{= it.user.name }}</p>', syncRender: true }
    , 'dust': { template: '<p>{#user}{name}{/user}</p>', syncRender: false }
    , 'eco': { template: '<p><%= @user.name %></p>', syncRender: true }
    , 'ejs': { template: '<p><%= user.name %></p>', syncRender: true }
    , 'haml': { template: '%p= user.name', syncRender: true }
    , 'haml-coffee': { template: '%p= @user.name', syncRender: true }
    , 'handlebars': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'hogan': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'html': { template: '<p>tobi</p>', syncRender: true }
    , 'jade': { template: 'p= user.name', syncRender: true }
    , 'jazz': { template: '<p>{user.name}</p>', syncRender: false }
    , 'jqtpl': { template: '<p>${user.name}</p>', syncRender: true }
    , 'just': { template: '<p><%= user.name %></p>', syncRender: false }
    , 'liquor': { template: '<p>#{user.name}</p>', syncRender: true }
    , 'mustache': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'qejs': { template: '<p><%= user.name %></p>', syncRender: false }
    , 'swig': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'underscore': { template: '<p><%= user.name %></p>', syncRender: true }
    , 'walrus': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'whiskers': { template: '<p>{user.name}</p>', syncRender: true }
    }
  ;

vows.describe('viewful-engines-test').addBatch({
  'When using `viewful`': helpers.generateEngineTests(engines, user, expected)
}).export(module);

