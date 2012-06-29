# Unreleased / Experimental

# viewful - Tiny and Isomorphic view engine for Flatiron

# Philosophy

`Viewful` is designed to establish the minimal amount of convention needed to create Isomorphic JavaScript views. It supports *all* templating engines available for JavaScript and is completely pluggable and over-ridable for customization. `Viewful` also includes a very basic <a href="#presenter">Presenter Pattern</a> to help build complex User-Interfaces.

# Installation

## Node

     npm install viewful
     
## Browser

     <script src="/path/to/viewful.js"></script>

# Usage


## Creating Views

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
  
The `View` now contains following properties:

### view.template

Template for the view. In this case, `"p= user.name"`

### view.render(data)

The render method for the view. Will use the `input` templating engine and use the `output` engine to show the rendered result

Ex: 
```
   view.render({user: { name: "Marak" }})
```

Outputs:
```
   <p>Marak</p>
```

*Note: Based on the templating engine, there might be several other rendering API options available, such as callbacks or streaming.*


### view.present()

The presenter method for the view. Intended to be used on the results of a `View.render` to apply Level 2 DOM Events to the rendered markup. In simple use-cases, you will not call this method.

## Loading a view from disk

### Define a View as a folder on your hard-drive

    /view
      create.jade
      show.jade
      list.jade

```
var view = new viewful.View({
  path: "./path/to/view",
  input: "jade",
  output: "html"
});
```

By design, a View won't attempt to load any template assets on construction. Templates are loading using the `View.load` method after the View has been created.

``` js
view.load();
```

This could also be performed asynchronously.

``` js
viewful.load(function (err, view) {
  console.log(view);
});
```

Once a view is loaded, it can be rendered using `View.render`.


`create.jade`

```
somejadestuff=
```

```js
var str = view.create.render({ title: 'hello' });
```

## Creating Presenters for Isomorphic Views
<a name="presenter"></a>
A "presenter" can be considered a function which takes data from a resource ( model ) and programmatically applies it to a rendered view.

In simple use-cases, you will not need to write a presenter as most templating languages for JavaScript take in markup and data, and return a rendered view. For Level 1 DOM rendering ( think generating HTML ), this is sufficient. Viewful supports 12+ JavaScript templating languages out of the box *and* and can auto-detect templating engines based on file name extensions, so in most cases you won't have to think about "presenters".

In more advanced use-cases, such as writing Isomorphic Views, you will want to create a presenter to act upon your view. This is particularly important when dealing with browser UI logic.


**Example:**

```
    /views
      button.html
      /presenter
        button.js

```

### button.html

```html
<div>
  <button id="thebutton">Do Something</button>
</div>
```

### button.js

```js
module.exports = function (options, callback) {
  // Remark: We get an isomorphic querySelectorAll poly-fill for free!
  var $ = this.$;
  $('#thebutton').html('Show alert');
  $('#thebutton').click(function(){
    alert('I am alert!');
  })
}
```

This will render:

```html
<div>
  <button id="thebutton">Show alert</button>
</div>
```

If DOM Level 2 Events are available ( such as a browser ! ), the presenter will also apply the click event to the button that triggers an alert when the button is clicked.


In our `button.js` presenter, the following variables will automatically be available in scope:

### Presenter.$

querySelectorAll / jQuery selector Polyfill. ( actual version of $ depends on environment )

  - Server-side will fall back to cheerio ( non-dom based ).
  - Client-side will use jQuery if available, and fall back to whatever selector engine the browser supports

### Presenter.View

The Viewful View class associated with this presenter. Useful for referencing logic and templates from other views.

## viewful.View options

All constructor options are optional.

*View options*

`options.path`
 - *String* - Path to where your view is located
`options.template`
 - *String* - Template for View
`options.input`
 - *String* - Input templating engine. Defaults to `Plates`
`options.output`
- *String* - Output templating engine. Defaults to `HTML`
`options.render`
 - *Function* - Override default rendering method for View
`options.present`
 - *Function* - Override default presenter method for View

The view object will attempt to auto-detect the templating engine based on the file-extension of each template. You can over-ride these settings by an `input` and `output` option.

# TODO

 - Add broadway plugin for every engine listed @ https://github.com/visionmedia/consolidate.js/blob/master/lib/consolidate.js
 - Improve core API sugar syntax
 - Create flatiron plugin based on https://github.com/flatiron/flatiron/blob/958928e8c936c7ac72c3fb88ee530b77a780e9ea/lib/flatiron/plugins/view.js
 - Better browser support
 - Better documentation and examples