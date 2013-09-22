define(function(require){
  var Backbone = require('backbone') || Backbone;
  var transitions = require('./transitions');
  var Errors = require('./errors');

  return {
    // Holds child views
    children: {}
    // If a child view is actually a constructor, move the 
    // constructor here and make the reference on children
    // the instance
  , ctrs: {}

    // List of children that have been appended
  , appended: []

    // Curent child name string
  , current: null

  , get: function(name){
      return this.children[name];
    }

  , provideChildren: function(children){
      this.children = children;
      return this;
    }

  , renderCurrent: function(){
      if (this.current){
        this.children[this.current].render();
        this.children[this.current].delegateEvents();
      }
      return this;
    }

  , changeView: function(child, options, callback){
      var this_ = this, transition, transitionOptions;

      if (typeof options == 'function'){
        callback = options;
        options = null;
      }

      options = options || {};

      transition        = transitions[options.transition] ? options.transition : 'none';
      transitionOptions = options.transitionOptions || {} ;

      // Clear out options so children onshow/hide do not get extra info
      delete options.transition;
      delete options.transitionOptions;

      // Do not transition into yourself
      if (child == this.current){
        transition = 'none';
      }

      // Child does not exist
      if (!this.children[child]){
        throw new Errors.InvalidChildName( child );
      }

      // Child has not been instantiated yet
      if (!(this.children[child] instanceof Backbone.View)){
        console.log("instantiating", child)
        // Attach parent view to Child
        this.children[child].prototype.parentView = this;

        // Move the constructor and instantiate
        this.ctrs[child] = this.children[child];
        this.children[child] = new this.ctrs[child](options);

        // Set initial display to none so we can switch them out
        this.children[child].$el.css('display', 'none');
      } 

      // Do we need to append this child?
      if ( this.appended.indexOf( child ) === -1 ){
        console.log("appending", child)
        this.$el.append(this.children[child].$el);
        this.appended.push( child );
      }

      // Store the old
      var old = this.current;
      this.current = child;

      if (!callback && !this.children[child].manualRender){
        this.children[child].render();
        this.children[child].delegateEvents();
      }

      if ( this.children[old] && this.children[old].onHide ){
        this.children[old].onHide( options );
      }

      transitions[transition](
        this.children[old]
      , this.children[child]
      , transitionOptions
      , function() {
          if ( this_.children[child].onShow ){
            this_.children[child].onShow( options );
          }

          if (callback) callback(null, this_.children[child]);

          this_.trigger('child:change', child, this_.children[child], old, this_.children[old]);
        }
      );

      return this;
    }
  };
});