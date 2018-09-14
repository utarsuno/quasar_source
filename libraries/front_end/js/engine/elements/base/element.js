'use strict';

$_QE.prototype.Element = function() {

    this.group              = null;

    this.element            = null;
    this.world              = null;
    this.currently_in_world = false;

    this.on_world_enter     = null;
    this.on_world_leave     = null;

    this.set_to_root_element = function() {
        if (this.group == null) {
            this.group = new THREE.Group();
        }
        //this.group.add(this.element);
    };

    this.set_group_user_data_if_needed = function() {
        if (this.group != null) {
            this.group.userData[USER_DATA_KEY_PARENT_OBJECT] = this;
        }
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
