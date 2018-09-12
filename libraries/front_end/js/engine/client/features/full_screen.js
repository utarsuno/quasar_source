'use strict';

$_QE.prototype.ClientFeatureFullScreen = function() {
    $_QE.prototype.ClientFeature.call(this, CLIENT_FEATURE_FULL_SCREEN, 'Fullscreen', false, !!document.webkitCancelFullScreen || !!document.mozCancelFullScreen);
};