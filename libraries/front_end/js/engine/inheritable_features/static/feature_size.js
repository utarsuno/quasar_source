'use strict';

$_QE.prototype.FeatureSize = function() {};

Object.assign($_QE.prototype.FeatureSize.prototype, {
    width : null,
    height: null,

    set_dimensions: function(w, h) {
        this.width  = w;
        this.height = h;
    }
});


