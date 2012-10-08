
var mappings = exports;

mappings.data = { user: { name: 'tobi' } }
mappings.engines = {
  'dot': { 
      template: '<p>{{= it.user.name }}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true
  }
  , 'dust': {
      template: '<p>{#user}{name}{/user}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: false
  }
  , 'eco': { 
      template: '<p><%= @user.name %></p>'
    , expected: '<p>tobi</p>'
    , syncRender: true
  }
  , 'ejs': {
      template: '<p><%= user.name %></p>'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'haml': { 
      template: '%p= user.name'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'haml-coffee': {
      template: '%p= @user.name'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'handlebars': {
      template: '<p>{{user.name}}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'hogan': {
      template: '<p>{{user.name}}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'html': {
      template: '<p>tobi</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true
  }
  , 'jade': {
      template: 'p= user.name'
    , expected: '<p>tobi</p>'
    , syncRender: true
  }
  , 'jazz': {
      template: '<p>{user.name}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: false 
  }
  , 'jqtpl': {
      template: '<p>${user.name}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'just': {
      template: '<p><%= user.name %></p>'
    , expected: '<p>tobi</p>'
    , syncRender: false 
  }
  , 'liquor': {
      template: '<p>#{user.name}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'mustache': {
      template: '<p>{{user.name}}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true 
  }
  , 'plates': { 
      template: '<p id="user"><span id="name"></span></p>'
    , expected: '<p id="user"><span id="name">tobi</span></p>'
    , syncRender: true 
  }
  , 'qejs': {
      template: '<p><%= user.name %></p>'
    , expected: '<p>tobi</p>'
    , syncRender: false 
  }
  , 'swig': {
      template: '<p>{{user.name}}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true
  }
  , 'underscore': {
      template: '<p><%= user.name %></p>'
    , expected: '<p>tobi</p>'
    , syncRender: true
  }
  , 'walrus': {
      template: '<p>{{user.name}}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true
  }
  , 'whiskers': {
      template: '<p>{user.name}</p>'
    , expected: '<p>tobi</p>'
    , syncRender: true
  } 
}
