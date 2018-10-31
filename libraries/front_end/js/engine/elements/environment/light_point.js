'use strict';

$_QE.prototype.LightPoint = function(color, intensity, distance, decay, x, y, z) {
    this.initialize_element_data();
    this.group = new THREE.PointLight(color, intensity, distance, decay);
    this.group.position.set(x, y, z);
    this.group.updateMatrix();
};

Object.assign(
    $_QE.prototype.LightPoint.prototype,
    $_QE.prototype.Element.prototype
);
