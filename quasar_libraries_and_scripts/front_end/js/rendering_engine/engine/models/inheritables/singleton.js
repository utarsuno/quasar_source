'use strict';

$_QE.prototype.Singleton = function() {
    this.switch_worlds = function(old_world, new_world) {
        old_world.remove_from_interactive_then_scene(this);
        new_world.add_to_scene(this.object3D);
        if (this.is_interactive) {
            new_world.interactive_objects.push(this);
        }
    };
};