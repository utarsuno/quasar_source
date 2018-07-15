'use strict';

$_QE.prototype.LightAmbient = function(color, intensity) {
    $_QE.prototype.FeatureSingleton.call(this);

    this.object3D = new THREE.AmbientLight(color, intensity);
};