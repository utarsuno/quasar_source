'use strict';

$_QE.prototype.ClientFeatureVirtualReality = function() {

    let enabled = false;
    if (navigator.getVRDisplays !== undefined) {
        let displays = navigator.getVRDisplays();
        if (displays.length !== 0) {
            enabled = true;
        }
    }

    $_QE.prototype.ClientFeature.call(this, CLIENT_FEATURE_VR, 'Virtual Reality', false, enabled);
};