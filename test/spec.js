define(function(require){
  var $         = require('jquery');
  var _         = require('underscore');
  var Backbone  = require('backbone');
  var Present   = require('backbone.present');

  // This is here to just test I have all the requirejs stuff
  // setup correctly
  describe('Loading', function(){
    it ('should pull in all dependencies', function(){
      expect( $ ).not.toBe( null );
      expect( _ ).not.toBe( null );
      expect( Backbone ).not.toBe( null );
      expect( Present ).not.toBe( null );
    });
  });

  // Just make sure the interface exists
  describe('Backbone.Present', function(){
    it ('should be an object with the correct properties', function(){
      expect( typeof Present ).toBe( 'object' );
      expect( 'regions' in Present ).toBe( true );
      expect( 'swapper' in Present ).toBe( true );
      expect( 'transitions' in Present ).toBe( true );
    });
  });

  describe('Backbone.Present.Regions', function(){
    it ('should attach views to region selectors', function(){
      var RegionView = Backbone.View.extend( _.clone( Present.regions ) );

      RegionView = RegionView.extend({
        template: _.template('<div class="my-region"></div>')

      , regions: {
          myRegion: '.my-region'
        }

      , children: {
          myRegion: new Backbone.View()
        }

      , render: function(){
          this.$el.html( this.template() );
          this.applyRegions();
          this.renderRegions();
          return this;
        }
      });

      var regionView = new RegionView().render();

      // It should 
      expect( regionView.children.myRegion.$el[0] ).toBe(
        regionView.$el.find('.my-region')[0]
      );
    });

    it ('should append views to region selectors', function(){
      var RegionView = Backbone.View.extend( _.clone( Present.regions ) );

      RegionView = RegionView.extend({
        template: _.template('<div class="my-region"></div>')

      , regions: {
          'myRegion>': '.my-region'
        }

      , children: {
          myRegion: new Backbone.View()
        }

      , render: function(){
          this.$el.html( this.template() );
          this.applyRegions();
          this.renderRegions();
          return this;
        }
      });

      var regionView = new RegionView().render();

      // It should 
      expect( regionView.children.myRegion.$el[0] ).toBe(
        regionView.$el.find('.my-region > div')[0]
      );
    });
  });

  describe('Backbone.Present.Swapper', function(){
    it ('should swap views', function(){
      var SwapperView = Backbone.View.extend( _.clone( Present.swapper ) );

      SwapperView = SwapperView.extend({
        children: {
          'view-1': Backbone.View.extend({ id: 'view-1' })
        , 'view-2': Backbone.View.extend({ id: 'view-2' })
        , 'view-3': Backbone.View.extend({ id: 'view-3' })
        , 'view-4': Backbone.View.extend({ id: 'view-4' })
        }
      });

      var swapperView = new SwapperView();

      swapperView.changeView('view-1');

      // Should have instantiated view-1 and moved constructor to ctrs
      expect( swapperView.get('view-1') instanceof Backbone.View ).toBe( true );
      expect( typeof swapperView.ctrs['view-1'] ).toBe('function');

      // Current should be view-1
      expect( swapperView.current ).toBe('view-1');

      // We should have appended the element
      expect( swapperView.$el.find('#view-1')[0] ).toBe(
        swapperView.children['view-1'].$el[0]
      );

      // Try changing views now
      expect( swapperView.children['view-2'] instanceof Backbone.View ).toBe( false );

      swapperView.changeView('view-2');
      expect( swapperView.get('view-2') instanceof Backbone.View ).toBe( true );
      expect( typeof swapperView.ctrs['view-2'] ).toBe('function');
      expect( swapperView.get('view-1').$el.css('display') ).toBe('none');
      expect( swapperView.get('view-2').$el.css('display') ).not.toBe('none');

      // We should have appended the element
      expect( swapperView.$el.find('#view-2')[0] ).toBe(
        swapperView.children['view-2'].$el[0]
      );
    });

    it ('should swap views with one instance and one class', function(){
      var SwapperView = Backbone.View.extend( _.clone( Present.swapper ) );

      SwapperView = SwapperView.extend({
        children: {
          'view-a': new (Backbone.View.extend({ id: 'view-a' }))()
        , 'view-b': Backbone.View.extend({ id: 'view-b' })
        }
      });

      var swapperView = new SwapperView();

      swapperView.changeView('view-a');

      // Should have instantiated view-a and moved constructor to ctrs
      expect( swapperView.get('view-a') instanceof Backbone.View ).toBe( true );

      // Current should be view-a
      expect( swapperView.current ).toBe('view-a');

      // We should have appended the element
      expect( swapperView.$el.find('#view-a')[0] ).toBe(
        swapperView.children['view-a'].$el[0]
      );

      // Try changing views now
      expect( swapperView.children['view-b'] instanceof Backbone.View ).toBe( false );

      swapperView.changeView('view-b');
      expect( swapperView.get('view-b') instanceof Backbone.View ).toBe( true );
      expect( typeof swapperView.ctrs['view-b'] ).toBe('function');
      expect( swapperView.get('view-a').$el.css('display') ).toBe('none');
      expect( swapperView.get('view-b').$el.css('display') ).not.toBe('none');

      // We should have appended the element
      expect( swapperView.$el.find('#view-b')[0] ).toBe(
        swapperView.children['view-b'].$el[0]
      );
    });
  });
});