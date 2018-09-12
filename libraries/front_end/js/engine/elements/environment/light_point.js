'use strict';

$_QE.prototype.LightPoint = function(color, intensity, distance, decay) {
    //$_QE.prototype.FeatureSingleton.call(this);

    $_QE.prototype.Element.call(this);

    //this.object3D = new THREE.PointLight(color, intensity, distance, decay);
    this.element = new THREE.PointLight(color, intensity, distance, decay);

    //this.set_to_root_element();
};