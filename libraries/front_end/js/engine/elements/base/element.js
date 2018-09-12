'use strict';

$_QE.prototype.Element = function() {

    this.root_element       = false;
    this.group              = null;

    this.element            = null;
    this.world              = null;
    this.currently_in_world = false;

    this.on_world_enter     = null;
    this.on_world_leave     = null;

    this.set_to_root_element = function() {
        this.group        = new THREE.Group();
        this.root_element = true;
        this.group.add(this.element);
    };

    this.world_enter = function(world) {
        if (this.currently_in_world) {
            this.world_exit();
        }
        this.currently_in_world = true;
        this.world              = world;
        // TODO: Check the whole parent/children/group status.
        this.world.add_to_scene(this.element);
    };

    this.world_exit = function() {
        if (this.world != null) {
            // TODO: Check the whole parent/children/group status.
            this.world.remove_from_scene(this.element);
            this.currently_in_world = false;
            if (this.on_world_leave != null) {
                this.on_world_leave();
            }
        }
    };
};
