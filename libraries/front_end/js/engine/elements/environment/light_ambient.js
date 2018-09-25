'use strict';

$_QE.prototype.LightAmbient = function(world_manager, color, intensity) {
    $_QE.prototype.FeatureSingleton.call(this, world_manager);
    $_QE.prototype.Element.call(this);
    this.element = new THREE.AmbientLight(color, intensity);
};