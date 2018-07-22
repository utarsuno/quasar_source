'use strict';

$_QE.prototype.ClientFeaturePointerLock = function() {
    // https://www.html5rocks.com/en/tutorials/pointerlock/intro/
    $_QE.prototype.ClientFeature.call(this, CLIENT_FEATURE_POINTER_LOCK, 'Pointer Lock', false, 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document);
};