'use strict';

$_QE.prototype.LightAmbient = function(world_manager, color, intensity) {
    //$_QE.prototype.FeatureSingleton.call(this, world_manager);
    world_manager.singletons.push(this);

    $_QE.prototype.Element.call(this);
    this.element = new THREE.AmbientLight(color, intensity);
};