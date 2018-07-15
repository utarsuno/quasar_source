'use strict';

$_QE.prototype.LightPoint = function(color, intensity, distance, decay) {
    $_QE.prototype.FeatureSingleton.call(this);

    this.object3D = new THREE.PointLight(color, intensity, distance, decay);

    this.set_position = function(x, y, z) {
        this.object3D.position.set(x, y, z);
    };
};