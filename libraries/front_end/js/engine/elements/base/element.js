'use strict';

$_QE.prototype.Element = function(is_base=false) {

    $_QE.prototype.FloatingElementMetaData.call(this);
    this.set_flag(EFLAG_IS_BASE, is_base);

    this.group              = null;
    this.element            = null;
    this.world              = null;

    this.set_to_root_element = function() {
        if (this.group == null) {
            this.group = new THREE.Group();
        }
    };

    this.world_enter = function(world) {
        if (this.get_flag(EFLAG_IN_WORLD)) {
            this.world_exit();
        }
        this.set_flag(EFLAG_IN_WORLD, true);
        this.world = world;
        // TODO: Check the whole parent/children/group status.
        this.world.add_to_scene(this.element);
        this.trigger_event(ELEMENT_EVENT_ON_WORLD_ENTER);
    };

    this.world_exit = function() {
        if (this.world != null) {
            // TODO: Check the whole parent/children/group status.
            this.world.remove_from_scene(this.element);
            this.set_flag(EFLAG_IN_WORLD, false);
            this.trigger_event(ELEMENT_EVENT_ON_WORLD_EXIT);
        }
    };
};
