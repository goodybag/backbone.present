# Regions, Swapping, and Transitions

Some simple view helpers that make common backbone patterns nicer. The module goes against convention and does not provide any new classes on the Backbone namespace. Instead, this module exposes namespaces that you can mixin to your view at your own discretion.

When you ```require('backbone.present')```, you'll be returned an object with the following properties:

* ```regions``` - Mixin for view region support
* ```swapper``` - Mixin for view swapping support
* ```transitions``` - Transitions object that swapper uses

___Note:___ _I wanted to leave creating a new namespace on Backbone up to the library consumer, but because of this decision, you need to be careful with object mutability. Just use ```_.clone``` to be safe._

___Also Note:___ _I used requirejs and this module requires that at the moment. I'll get around to building a version that does not.._

## Regions

Declaratively assign views to elements:

```javascript
var Backbone = require('backbone');
var _ = require('underscore');
var Present = require('backbone.present');

// Make all views have regions
// Be sure to clone the object since Present just exposes an object
Backbone.View = Backbone.View.extend( _.clone( Present.regions ) );

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
    'page-1': Views.Page1
  , 'page-2': Views.Page2
  , 'page-3': new Views.Page3()
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
// When instantiating page-2, pass in options
// If page-2 is already instantiated, pass to onShow method
appContent.showView('page-2', { model: myModel });
```

__Methods for Swapper:__

#### get( child )

Return the child view. Same thing as ```swapperView.children[ child ]```.

#### provideChildren( children )

Sets the ```this.children``` object. May be an object of View constructors or instances of View constructors.

#### renderCurrent()

Renders the currently shown view.

#### changeView( child, [options] )

Returns the child view. Swaps out the current view with the child specified.

#### onShow( options )

Optionally, you can implement your own onShow method that will be called with the options passed in from showView after the view has been shown.

#### onHide()

Optionally, you can implement your own onHide method that will be called just before the view has been hidden.

_options:_

* transition (Backbone.Present ships with none and fade)
* onViewAAnimationStart - function( previousView ) called before transition animation starts
* onViewAAnimationEnd - function( previousView ) called after transition animation completes
* onViewBAnimationStart - function( currentView ) called before transition animation starts
* onViewBAnimationEnd - function( currentView ) called after transition animation completes

### Why not use Backbone.Chaplin|Marionette|LayoutManager

Because I'm lazy I don't know jeez get off my back.
