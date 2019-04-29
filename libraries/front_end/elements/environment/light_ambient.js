'use strict';

$_QE.prototype.LightAmbient = function(color, intensity, alias) {
    this.create_singleton(color, intensity);
    this.set_alias(alias);
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
