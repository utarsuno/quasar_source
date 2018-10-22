'use strict';

$_QE.prototype.Element = function() {};

Object.assign(
    $_QE.prototype.Element.prototype,
    {
        group: null,
        world: null,

        get_object: function() {
            if (this.group != null) {
                return this.group;
            }
            return this.mesh;
        },

        /*
        this.set_flag(EFLAG_IS_BASE, is_base);
         */

        /*
        world_enter: function(world) {
            if (this.get_flag(EFLAG_IN_WORLD)) {
                this.world_exit();
            }
            this.set_flag(EFLAG_IN_WORLD, true);
            this.world = world;
            // TODO: Check the whole parent/children/group status.
            this.world.add_to_scene(this.element);
            this.trigger_event(ELEMENT_EVENT_ON_WORLD_ENTER);
        },

        world_exit: function() {
            if (this.world != null) {
            // TODO: Check the whole parent/children/group status.
                this.world.remove_from_scene(this.element);
                this.set_flag(EFLAG_IN_WORLD, false);
                this.trigger_event(ELEMENT_EVENT_ON_WORLD_EXIT);
            }
        },
        */
    }
);


