var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

var user = { user : { name: "tobi" } };

vows.describe('viewful-engines-test').addBatch({
  'When using `viewful`': {
    'a new viewful.View({ input: "jade" })': {
      topic: new viewful.View({
        template: "p= user.name",
        input: "jade"
      }),
      'should return a new View': function (_view) {  
        assert.isObject(_view);
      },
      'should contain "render" function': function (_view) {
        assert.isFunction(_view.render);
      },
      'should contain default "input"': function (_view) {
        assert.equal("jade", _view.input);
      },
      'should contain default "output"': function (_view) {
        assert.equal("html", _view.output);
      },
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "swig" })': {
      topic: new viewful.View({
        template: "<p>{{user.name}}</p>",
        input: "swig"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "liquor" })': {
      topic: new viewful.View({
        template: "<p>#{user.name}</p>",
        input: "liquor"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "dust" })': {
      topic: new viewful.View({
        template: "<p>{#user}{name}{/user}</p>",
        input: "dust"
      }),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "ejs" })': {
      topic: new viewful.View({
        template: "<p><%= user.name %></p>",
        input: "ejs"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "eco" })': {
      topic: new viewful.View({
        template: "<p><%= @user.name %></p>",
        input: "eco"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "jazz" })': {
      topic: new viewful.View({
        template: "<p>{user.name}</p>",
        input: "jazz"
      }),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "jqtpl" })': {
      topic: new viewful.View({
        template: "<p>${user.name}</p>",
        input: "jqtpl"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "haml" })': {
      topic: new viewful.View({
        template: "%p= user.name",
        input: "haml"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "whiskers" })': {
      topic: new viewful.View({
        template: "<p>{user.name}</p>",
        input: "whiskers"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "haml-coffee" })': {
      topic: new viewful.View({
        template: "%p= @user.name",
        input: "haml-coffee"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "hogan" })': {
      topic: new viewful.View({
        template: "<p>{{user.name}}</p>",
        input: "hogan"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "handlebars" })': {
      topic: new viewful.View({
        template: "<p>{{user.name}}</p>",
        input: "handlebars"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "underscore" })': {
      topic: new viewful.View({
        template: "<p><%= user.name %></p>",
        input: "underscore"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "qejs" })': {
      topic: new viewful.View({
        template: "<p><%= user.name %></p>",
        input: "qejs"
      }),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "walrus" })': {
      topic: new viewful.View({
        template: "<p>{{user.name}}</p>",
        input: "walrus"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    },

    'a new viewful.View({ input: "mustache" })': {
      topic: new viewful.View({
        template: "<p>{{user.name}}</p>",
        input: "mustache"
      }),
      'and calling View.render(user)': helpers.renderSync(user, "<p>tobi</p>"),
      'and calling View.render(user, cb)': helpers.render(user, "<p>tobi</p>")
    }

  }
}).export(module);

