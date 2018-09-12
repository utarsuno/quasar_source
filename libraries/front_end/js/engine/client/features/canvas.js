'use strict';

$_QE.prototype.ClientFeatureCanvas = function() {
    $_QE.prototype.ClientFeature.call(this, CLIENT_FEATURE_CANVAS, 'HTML Canvas', true, !!window.CanvasRenderingContext2D);
};