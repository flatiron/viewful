
# Unreleased / Experimental

# viewful - Tiny and Isomorphic view engine for Flatiron

# Installation

## Node

     npm install viewful
     
## Browser

     <script src="/path/to/viewful.js"></script>

# Usage

## Creating Views


Define a view as a folder on your hard-drive

    /view
      /template
        create.html
        show.html
        list.html

Next, you'll want to load the view in your app.

``` js
var viewful = require('viewful');
var view = viewful.load("./path/to/view");
```
This could also be done asynchronously  

``` js
viewful.load("./path/to/view", function (err, view) {
  console.log(view);
});
```

Once a view is loaded you can render it.

```js
var str = view['create'].render({ title: 'hello' });
```

*Note: Based on the engine, there might be several other API options available, such as callbacks or streaming.*

A View has the following properties:

### view.views

Object hash containing all loaded views.

### view.views['create']

The View. In this case, `create`.

### view.views['create'].template

Template for the view. In this case, the html loaded from `create.html`.

### view.views['create'].render()

The render method for the view. Will run template engine associated with file extension against the template and return the results.

### view.views['create'].present()

The presenter method for the view. Intended to be used after `View.render` is called to apply Level 2 DOM Events to the rendered markup. In simple use-cases, you will not call this method.


## Creating Presenters for Isomorphic Views

A "presenter" can be considered a function which takes data from a resource ( model ) and programmatically applies it to a rendered view.

In simple use-cases, you will not need to write a presenter as most templating languages for JavaScript take in markup and data, and return a rendered view. For Level 1 DOM rendering ( think generating HTML ), this is sufficient. Viewful supports 12+ JavaScript templating languages out of the box *and* and can auto-detect templating engines based on file name extensions, so in most cases you won't have to think about "presenters".

In more advanced use-cases, such as writing Isomorphic Views, you will want to create a presenter to act upon your view. This is particularly important when dealing with browser UI logic.


**Example:**

```
    /views
      /template
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

### this.$

querySelectorAll / jQuery selector Polyfill. ( actual version of $ depends on environment )

  - Server-side will fall back to cheerio ( non-dom based ).
  - Client-side will use jQuery if available, and fall back to whatever selector engine the browser supports

### this.View

The Viewful View class associated with this presenter. Useful for referencing logic and templates from other views.


# TODO

 - Add broadway plugin for every engine listed @ https://github.com/visionmedia/consolidate.js/blob/master/lib/consolidate.js
 - Improve core API sugar syntax
 - Create flatiron plugin based on https://github.com/flatiron/flatiron/blob/958928e8c936c7ac72c3fb88ee530b77a780e9ea/lib/flatiron/plugins/view.js
 - Better browser support
 - Better documentation and examples