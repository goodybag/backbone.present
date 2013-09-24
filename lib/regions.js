/**
 * Regions Mixin
 *
 * Apply to default backbone view:
 *
 * var backbonePresent = require('backbone.present');
 *
 * Backbone.View = Backbone.View.extend( backbonePresent.regions );
 */

define(function(require){
  var Backbone = require('backbone') || window.Backbone;

  return {
    applyRegions: function(){
      var append;
      for (var key in this.regions){
        // If user is denoting append syntax
        if (key[key.length - 1] == '>'){
          append = true;
          // Normalize key string so we can use it.. normally
          key = key.substring(0, key.length - 1);
        } else append = false;

        // They did not specify a corresponding child
        if (!(key in this.children)) continue;

        // Append the element instead of setting the element
        if (append){
          // We need to do some cleanup if the element was in append mode
          // If this instance existed before, let's clear everything
          // and start from a clean slate

          // Actually, let's just remove this to see if it causes/fixes problems
          // this.children[key].$el.remove();
          // this.children[key].undelegateEvents();

          this.$el.find(this.regions[key + '>']).append(
            this.children[key].$el
          );
        } else {
          // Otherwise, just attach the views element to the parent
          this.$el.find(this.regions[key]).replaceWith(
            this.children[key].$el
          );
        }

        // Apply the className defined on the view
        if (this.children[key].constructor.prototype.className){
          this.children[key].$el.addClass(
            this.children[key].constructor.prototype.className
          );
        }
      }

      return this;
    }

  , renderRegions: function(){
      for ( var key in this.regions ){
        this.children[key.replace('>', '')].render();
        this.children[key.replace('>', '')].delegateEvents();
      }

      return this;
    }
  };
});