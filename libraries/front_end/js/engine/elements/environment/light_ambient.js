'use strict';

$_QE.prototype.LightAmbient = function(color, intensity) {
    this.initialize_element_data();
    this.group = new THREE.AmbientLight(color, intensity);
};

Object.assign(
    $_QE.prototype.LightAmbient.prototype,
    $_QE.prototype.Element.prototype
);
