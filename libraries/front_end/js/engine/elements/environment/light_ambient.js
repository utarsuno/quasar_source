'use strict';

$_QE.prototype.LightAmbient = function() {
    this.initialize_element_data();
};

Object.assign(
    $_QE.prototype.LightAmbient.prototype,
    $_QE.prototype.Element.prototype,
    {
        create_singleton: function(world_manager, color, intensity) {
            this.group = new THREE.AmbientLight(color, intensity);
            world_manager.singleton_add(this);
            return this;
        },
    }
);
