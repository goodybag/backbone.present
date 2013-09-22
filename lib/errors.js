define(function(require){
  var ErrorFactory = function( name, message ){
    var Ctr = function( _message ){
    };

    return Ctr;
  };

  var errors = {
    InvalidChildName: function( child ){
      this.name = name;
      this.message = 'Backbone.Present cannot find child view `' + child + '`';
    }
  };

  for ( var key in errors ){
    errors[ key ].prototype = Error.prototype;
  }

  return errors;
});