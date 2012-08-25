## Unreleased / Experimental

# viewful - tiny and isomorphic consolidated view engine

# Overview

 - **Viewful establishes the minimal amount of convention needed to create JavaScript views.**
 - **Viewful makes no assumptions about your application or templating choices.**

# Features

 - Supports [all templating engines](https://github.com/flatiron/viewful/tree/master/lib/engines) available for JavaScript
 - Isomorphic ( views work on the browser and server )
 - Seamless loading and mapping of views from the file-system or remote webserver
 - Views can be infinitely nested, i.e. uber-partials / subviews
 - Views contain a very basic <a href="#presenter">Presenter Pattern</a> for assisting in building rich isomorprhic interfaces with graceful no-script fallbacks ( Presenters are more convention than code )

# Installation

## Node

    npm install viewful

## Browser

    <script src="/path/to/cdn/viewful.js"></script>

# Usage
     
## Views can render strings

``` js

var viewful = require('viewful');

//
// Create a simple view using a string of Jade
//
var view = new viewful.View({ 
  template: "p= user.name",
  input: "jade" 
});

view.render({ user: { name: "bob" }});

```

**outputs:**

```html
<p>bob</p>
```

``` js

var viewful = require('viewful');

//
// Create a simple view using a string of HTML
//
var view = new viewful.View({ 
  template: '<p class="name"></p>',
  input: "plates" 
});

view.render({ user: { name: "bob" }});
```

**outputs:**

```html
<p>bob</p>
```
## Views can be loaded from disk

- jade
  - creature
    - create.jade
    - show.jade
    - layout.jade

In most cases, a View will be based on a file or a folder of files. Viewful can automatically handle the process of loading template files through the `View.load` method.


*Note: The `jade` folder consists of a creature view using the Jade templating language*

```js
var view = new viewful.View({
  path: "./examples/view/jade",
  input: "jade",
  output: "html"
});
```

**Important: By design, a View will not automatically attempt to load template assets on construction. Templates are loaded using the `View.load` method after the View has been constructed.**

```js
view.load();
```

This same operation can also be performed asynchronously.

```js
viewful.load(function (err, view) {
  console.log(view);
});
```

Once the view is loaded, it can be rendered using `View.render`.

```js
var html = view.creatures.create.render({ user: { name: "Marak" }});
```

`html` will now contain the following string:

```html
<p>Marak</p>
```

<a name="presenter"></a>
# View Presenters
A **Presenter** can be considered a function which performs actions on an already rendered view.

In simple use-cases, you will not need to write a presenter. In **Level 1 DOM rendering** ( such as generating server-side HTML to return to the client ), you will not use `View.present`. 

In "web-pages", you'll just be generating markup and won't have to think about writing a "presenter". In more advanced use-cases, such as creating rich user-interfaces, you will want to create a **Presenter to act upon your View**. 

Presenters are particularly important when implementing data-binding, browser events ( such as mouse and keyboard ), or graceful no-script compatible fallbacks for complex interfaces.


**TL:DR; View Presenters are advantageous, but not mandatory.**

## Click a Button to Alert Example

- myview
 - button.html
 - button.js

### button.html

```html
<div>
  <button id="thebutton">{{label}}</button>
</div>
```
```js
var view = new viewful.View({
  input: "swig",
  path: "./path/to/myview"
});

// load the view
view.load();

// render the view
view.button.render({ label: "Show Alert" });
```
### button.js

```js
module.exports = function (options, callback) {
  // Remark: We get an isomorphic querySelectorAll poly-fill for free!
  var $ = this.$;
  $('#thebutton').click(function(){
    alert('I am alert!');
  })
}
```

**Output:**

```html
<div>
  <button id="thebutton">Show Alert</button>
</div>
```

```js
// present the View, triggering event bindings
view.button.present();
```

If DOM Level 2 Events are available ( such as a browser ! ), the presenter will apply the click event to the button that triggers an alert when the button is clicked.

Our `button.js` `Presenter` has the following methods bound into scope.

## `View` Class

### view.template

Template for the view. In this case, `p= user.name`

### view.render(data)

The render method for the view. Will use `input` and `output` templating engines.

**Ex:** 
```js
view.render({user: { name: "Marak" }})
```

**Outputs:**
```html
<p>Marak</p>
```

*Note: Based on the templating engine, there might be several other rendering API options available, such as callbacks or streaming.*

### view.load(path, /* callback */)

A helper method for loading views from a file or a folder, synchronously or asynchronously, on the browser or the server. `View.load` is optional if a `template` string has already been specified.

### view.present(data)

`View.present` is intended to be called on the results of a template rendered with `View.render()`. In the <a href="#presenter">presenter</a>, you can bind Level 2 DOM Events (like a mouse click) to the rendered markup. In simple use-cases, you will not use this method.

### view.View

Views can contain abritrary nested sub-views.


## viewful.View options

All constructor options are optional.

### options.path

 - *String* - Path to where your view is located

### options.template

 - *String* - Template for View

### options.input

 - *String* - Input templating engine. Defaults to `Plates`
 
### options.output
 
 - *String* - Output templating engine. Defaults to `HTML`
 
### options.render
 
 - *Function* - Override default rendering method for View
 
### options.present

 - *Function* - Override default presenter method for View

*Note: The view object will attempt to auto-detect the templating engine based on the file-extension of each template. You can over-ride these settings by an `input` and `output` option.*

# TODO

  - Add broadway plugin for every engine listed @ https://github.com/visionmedia/consolidate.js/blob/master/lib/consolidate.js
  - Add tests to verify that options are being passed into template engine render function correctly.
  - Refactor each plugin to use named function expressions for attach(), init() and render(). Ensure minification process removes names for cross-browser compatibilty.
  - Add options as optional parameter of View.render(). Currently, template engine plugins can only be configured with options at app.attach().
 - Improve core API sugar syntax
 - Create flatiron plugin based on https://github.com/flatiron/flatiron/blob/958928e8c936c7ac72c3fb88ee530b77a780e9ea/lib/flatiron/plugins/view.js
 - Better browser support
 - Better documentation and examples
