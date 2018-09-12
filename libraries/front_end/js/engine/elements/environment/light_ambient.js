'use strict';

$_QE.prototype.LightAmbient = function(color, intensity) {
    //$_QE.prototype.FeatureSingleton.call(this);
    //this.object3D = new THREE.AmbientLight(color, intensity);

    $_QE.prototype.Element.call(this);

    this.element = new THREE.AmbientLight(color, intensity);
    //this.set_to_root_element();
};