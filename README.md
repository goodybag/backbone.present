# Backbone.Present - Regions, Swapping, and Transitions

Some simple view helpers that make common backbone patterns nicer. The module goes against convention and does not provide any new classes on the Backbone namespace. Instead, this module exposes namespaces that you can mixin to your view at your own discretion.

When you ```require('backbone.present')```, you'll be returned an object with the following properties:

* ```regions``` - Mixin for view region support
* ```swapper``` - Mixin for view swapping support

## Regions

Declaratively assign views to elements:

```javascript
var Present = require('backbone.present');

// Make all views have regions
Backbone.View = Backbone.View.extend( Present.regions );

// Create application view/layout
var MyApp = Backbone.View.extend({
  // Specify regionName: '.selector'
  regions: {
    // The header region is applied to the .header element
    header:   '.app-header'
  , content:  '.app-content'
  , sidebar:  '.app-sidebar'
  }

  // Map regionName: backboneViewInstance
, children: {
    header:   new Views.AppHeader()
  , content:  new Views.AppContent()
  , sidebar:  new Views.AppSidebar()
  }
});
```

__Methods from regions:__

#### applyRegions()

Applies the regions on the view.

#### delegateEvents()

Override of delegateEvents to automatically call applyRegions.

## Swapper

Easily show, hide, views.

```javascript
var Present = require('backbone.present');

// Make all views have swappers
Backbone.View = Backbone.View.extend( Present.swapper );

// Create application content view swapper
var AppContent = Backbone.View.extend({
  // Map viewIdentifiers: viewInstances or constructors
  children: {
    'page-1': new Views.Page1
  , 'page-2': new Views.Page2
  , 'page-3': new Views.Page3
  }
});

var appContent = new AppContent();

// Optionally pass a callback to get reference to view
// after the view has been shown
// If you do not pass a callback, swapper automatically calls
// view.render() for you
appContent.showView('page-1', function( view ){
  view.model = someOtherModel;
  view.render();
});

// Hides page-1, shows page-2 using default transitions
appContent.showView('page-2');
```