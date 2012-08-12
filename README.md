## Unreleased / Experimental

# viewful - tiny and isomorphic consolidated view engine


# Overview

`Viewful` establishes the minimal amount of convention needed to create Isomorphic JavaScript views. `Viewful` makes no assumptions about your application or templating choices. It supports *all* templating engines available for JavaScript and is completely pluggable for customization. `Viewful` also includes a basic <a href="#presenter">Presenter Pattern</a> for building rich user interfaces that will gracefully fallback to server-side templating.

# Installation

## Node

     npm install viewful
     
## Browser

     <script src="/path/to/viewful.js"></script>

# Usage


## Creating a View

``` js

//
// Require viewful in our script
//
var viewful = require('viewful');

//
// Create a simple view using a string of Jade
//
var view = new viewful.View({ 
  template: "p= user.name",
  input: "jade",
  output: "html" 
});
```
  
A `View` has the following properties:

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

## Loading a view from disk

In most cases, a View will be based on a file or a folder of files. Viewful can automatically handle the process of loading template files through the `View.load` method.

### Define a View as a folder on your hard-drive

    /myview
      create.jade
      show.jade
      list.jade

*Note: The `myview` folder consists of three files using the Jade templating language*

```js
var view = new viewful.View({
  path: "./path/to/myview",
  input: "jade",
  output: "html"
});
```

**Note: By design, a View will not automatically attempt to load template assets on construction. Templates are loaded using the `View.load` method after the View has been constructed.**

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


`/myview/create.jade`
```
p= user.name
```

```js
var html = view.create.render({ user: { name: "Marak" }});
```

`html` will now contain the following string:

```html
<p>Marak</p>
```

<a name="presenter"></a>
## Creating View Presenters
A **Presenter** can be considered a function which takes data and programmatically applies it to a rendered template. The source of the data is unknown to the template and the rendered result is unknown to the data source.

In simple use-cases, you will not need to write a presenter. Most templating engines for JavaScript provide a render method which takes in data and applies it to a template.  In Level 1 DOM rendering ( such as generating HTML ), using `View.render` is sufficient. In most cases you'll just be generating markup and won't have to think about a writing "presenter".

In more advanced use-cases, such as writing Isomorphic Views, you will want to create a Presenter to act upon your View. This is particularly important when implementing data-binding, or dealing with browser UI logic such as mouse and keyboard events.

**Button Alert Example:**

```
/myview
  button.html
  button.js
```

### button.html

```html
<div>
  <button id="thebutton">{{label}}</button>
</div>
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

```js

// Create a new view
var view = new viewful.View({
  input: "swig",
  path: "./path/to/myview"
});

// Load the view
view.load();

// Render the view
view.button.render({ label: "Show Alert" });
```

This will render:

```html
<div>
  <button id="thebutton">Show Alert</button>
</div>
```

```js
// Now we Present the View, triggering our event bindings
view.button.present();
```

If DOM Level 2 Events are available ( such as a browser ! ), the presenter will apply the click event to the button that triggers an alert when the button is clicked.

Our `button.js` `Presenter` has the following methods bound into scope.

### Presenter.$

A querySelectorAll / jQuery selector Polyfill. The actual version of $ depends on what is detected in the environment.

**Server-side**

 - Cheerio ( non-dom based )
 
**Browser**

  - jQuery if available
  - Fall back to querySelectorAll if available
  - Falls back to included Zepto.js

### Presenter.view

The `viewful.View` class associated with the presenter. Useful for referencing information about the View.

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
   - Possibly remove jade engine tests except for render() test?.. all tests except render pass without jade plugin directory, they seem to test view plugin functionality instead of engine plugin functionality
 - Improve core API sugar syntax
 - Create flatiron plugin based on https://github.com/flatiron/flatiron/blob/958928e8c936c7ac72c3fb88ee530b77a780e9ea/lib/flatiron/plugins/view.js
 - Better browser support
 - Better documentation and examples
