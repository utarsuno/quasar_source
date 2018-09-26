'use strict';

$_QE.prototype.FeatureButton = function(engage_function) {

    $_QE.prototype.FeatureInteractive.call(this, true, null, null, engage_function, null);
    $_QE.prototype.FeatureClickable.call(this, false);

};
