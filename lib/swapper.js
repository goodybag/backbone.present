define(function(require){
  var transitions = require('./transitions');

  return {
    className: 'pages'

  , initialize: function(options){
      options = options || {};

      // Non-instantiated views
      this.Pages = options.Pages;

      // Instantiated views
      this.pages = {};

      this.parentView = options.parentView;

      // Current page
      this.current = null;

      return this;
    }

  , get: function(name){
      return this.pages[name];
    }

  , providePages: function(Pages){
      this.Pages = Pages;
      return this;
    }

  , renderCurrent: function(){
      if (this.current){
        this.pages[this.current].render();
        this.pages[this.current].delegateEvents();
      }
      return this;
    }

  , changePage: function(page, options, callback){
      var this_ = this, transition, transitionOptions;

      if (typeof options == 'function'){
        callback = options;
        options = null;
      }

      options = options || {};

      transition        = transitions[options.transition] ? options.transition : 'fade';
      transitionOptions = options.transitionOptions || {} ;

      // Clear out options so pages onshow/hide do not get irrelev
      delete options.transition;
      delete options.transitionOptions;

      // Do not transition into yourself
      if (page == this.current)
        transition = 'none';

      if (!this.Pages[page]){
        // TODO: don't do this
        var error = {
          message: "Cannot find page: " + page
        , page: page
        };

        if (callback) callback(error);
        else troller.error(error);

        return this;
      }

      if (!this.pages[page]){
        // Attach parent view to Page
        if (this.parentView)
          this.Pages[page].prototype.parentView = this.parentView;

        this.pages[page] = new this.Pages[page](options);
        this.pages[page].$el.css('display', 'none');

        // Allow child pages to request change pages
        this.pages[page].setPageManager(this);

        // Set initial display to none so we can switch them out
        if (options && options.renderFn) options.renderFn();

        this.$el.append(this.pages[page].$el);
      }

      // Store the old
      var old = this.current;
      this.current = page;

      if (!callback && !this.pages[page].manualRender){
        this.pages[page].render();
        this.pages[page].delegateEvents();
      }

      if ( this.pages[old] && this.pages[old].onHide ) this.pages[old].onHide( options );
      transitions[transition]( this.pages[old], this.pages[page], transitionOptions, function() {
        if ( this_.pages[page].onShow ) this_.pages[page].onShow( options );

        if (callback) callback(null, this_.pages[page]);

        this_.trigger('page:change', page, this_.pages[page], old, this_.pages[old]);
      });

      return this;
    }
  };
});