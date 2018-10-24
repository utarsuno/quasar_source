'use strict';

$_QE.prototype.LightPoint = function() {
    this.initialize_element_data();
};

Object.assign(
    $_QE.prototype.LightPoint.prototype,
    $_QE.prototype.Element.prototype,
    {
        create_singleton: function(world_manager, color, intensity, distance, decay, x, y, z) {
            this.group = new THREE.PointLight(color, intensity, distance, decay);
            this.group.position.set(x, y, z);
            this.group.updateMatrix();
            world_manager.singleton_add(this);
            return this;
        },
    }
);
