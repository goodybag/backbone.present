define(function(require){
  var transitions = {};

  transitions.none = function(viewA, viewB, options, callback){    
    // Transition viewA out
    if (options.onViewAAnimationStart) options.onViewAAnimationStart(viewA);
    if (viewA) viewA.$el.css('display', 'none');
    if (options.onViewAAnimationComplete) options.onViewAAnimationComplete(viewA);

    // Transition viewB in
    if (options.onViewBAnimationStart) options.onViewBAnimationStart(viewB);
    viewB.$el.css('display', '');
    if (options.onViewBAnimationComplete) options.onViewBAnimationComplete(viewB);

    // Transition completed
    if (callback) callback();
  };

  transitions.fade = function(viewA, viewB, options, callback){
    (function(done){
      if (!viewA) return done();

      // Transition viewA out
      if (options.onViewAAnimationStart) options.onViewAAnimationStart(viewA);
      viewA.$el.fadeOut(function() {
        if (options.onViewAAnimationComplete) options.onViewAAnimationComplete(viewA);  
        done();
      });
      
    })(function(){    
      // Transition viewB in
      if (options.onViewBAnimationStart) options.onViewBAnimationStart(viewB);
      viewB.$el.fadeIn(callback);
      if (options.onViewAAnimationComplete) options.onViewAAnimationComplete(viewA);      
    });
  };

  return transitions;
});