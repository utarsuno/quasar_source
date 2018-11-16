'use strict';

$_QE.prototype.LightAmbient = function(color, intensity) {
    this.create_singleton(color, intensity);
    this.set_alias(SINGLETON_AMBIENT);
};

Object.assign(
    $_QE.prototype.LightAmbient.prototype,
    $_QE.prototype.ElementSingleton.prototype,
    {
        __init__: function(color, intensity) {
            this.group = new THREE.AmbientLight(color, intensity);
        },
    }
);
