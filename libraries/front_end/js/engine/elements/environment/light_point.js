'use strict';

$_QE.prototype.LightPoint = function(color, intensity, distance, decay, x, y, z) {
    this.create_singleton(color, intensity, distance, decay, x, y, z);
};

Object.assign(
    $_QE.prototype.LightPoint.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        __init__: function(color, intensity, distance, decay, x, y, z) {
            this.group = new THREE.PointLight(color, intensity, distance, decay);
            this.group.position.set(x, y, z);
            this.group.updateMatrix();
        },
    }
);
