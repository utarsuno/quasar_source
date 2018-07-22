'use strict';

$_QE.prototype.ClientFeatureWebGL = function() {
    $_QE.prototype.ClientFeature.call(this, CLIENT_FEATURE_WEBGL, 'WebGL', true, !!window.WebGLRenderingContext);
};