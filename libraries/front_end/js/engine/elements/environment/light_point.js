'use strict';

$_QE.prototype.LightPoint = function(world_manager, color, intensity, distance, decay) {
    $_QE.prototype.FeatureSingleton.call(this, world_manager);
    $_QE.prototype.Element.call(this);
    this.element = new THREE.PointLight(color, intensity, distance, decay);
};