'use strict';

$_QE.prototype.WorldEnvironment = function() {

    this.update = function(delta) {
    };

    this.switch_to_new_world = function(old_world, new_world) {
        old_world.remove_from_scene(this.light);

        new_world.add_to_scene(this.light);
    };

    this.create = function(world) {
        // soft white light
        this.light = new THREE.AmbientLight(0xffffff, .60);
        world.add_to_scene(this.light);
    };
};
