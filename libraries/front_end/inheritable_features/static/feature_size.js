'use strict';

$_QE.prototype.FeatureSize = function() {};

Object.assign($_QE.prototype.FeatureSize.prototype, {

    set_dimensions: function(w, h) {
        // TODO: Have this in DEV/QA version only!
        if (w < 0) {
            QE.warning('Width is negative {' + w + '}');
        }
        if (h < 0) {
            QE.warning('Height is negative {' + h + '}');
        }
        this.width  = w;
        this.height = h;
    }

});


