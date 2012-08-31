var assert = require('assert')
  , vows = require('vows')
  , helpers = require('./helpers')
  , viewful = require('../lib/viewful')
  ;

var user = { user : { name: "tobi" } }
  , expected = '<p>tobi</p>'
  , engines = {
      'jade': { template: 'p= user.name', syncRender: true }
    , 'swig': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'liquor': { template: '<p>#{user.name}</p>', syncRender: true }
    , 'dust': { template: '<p>{#user}{name}{/user}</p>', syncRender: false }
    , 'ejs': { template: '<p><%= user.name %></p>', syncRender: true }
    , 'eco': { template: '<p><%= @user.name %></p>', syncRender: true }
    , 'jazz': { template: '<p>{user.name}</p>', syncRender: false }
    , 'jqtpl': { template: '<p>${user.name}</p>', syncRender: true }
    , 'haml': { template: '%p= user.name', syncRender: true }
    , 'whiskers': { template: '<p>{user.name}</p>', syncRender: true }
    , 'haml-coffee': { template: '%p= @user.name', syncRender: true }
    , 'hogan': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'handlebars': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'underscore': { template: '<p><%= user.name %></p>', syncRender: true }
    , 'qejs': { template: '<p><%= user.name %></p>', syncRender: false }
    , 'walrus': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'mustache': { template: '<p>{{user.name}}</p>', syncRender: true }
    , 'dot': { template: '<p>{{= it.user.name }}</p>', syncRender: true }
    , 'just': { template: '<p><%= user.name %></p>', syncRender: false }
    }
  ;

vows.describe('viewful-engines-test').addBatch({
  'When using `viewful`': helpers.generateEngineTests(engines, user, expected)
}).export(module);

