'use strict';

$_QE.prototype.FloatingElement = function() {
    this.set_flag(EFLAG_VISIBLE, true);
};

Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.Element.prototype,
    {
        set_to_button: function(engage_function, use_confirmation_prompt=false) {
            $_QE.prototype.FeatureButton.call(this, engage_function);
            if (use_confirmation_prompt) {
                this.use_confirmation_prompt();
            }
        },

        update_element: function() {
            if (this.consume_flag(EFLAG_UPDATE_POSITION) || this.get_flag(EFLAG_UPDATE_NORMAL)) {
                this.refresh();
                if (this.get_flag(EFLAG_IS_BASE)) {
                    this.re_cache_normal();
                }
            }

            // TODO: set this to an event!
            if (this.update != null) {
                this.update();
            }

            if (this.consume_flag(EFLAG_UPDATE_CHILD)) {
                let c;
                for (c = 0; c < this.attachments.length; c++) {
                    this.attachments[c].update_element();
                }
            }
        },

        add_to_world: function(world, create=false, set_to_group=true, add_to_scene=false) {
            this.world = world;

            // TODO: Refactor this
            if (set_to_group) {
                this.set_to_root_element();
            }

            //if (create) {
            //    this.create();
            //    this.set_flag(EFLAG_CREATED, true);
            //}

            if (add_to_scene) {
                this.set_flag(EFLAG_IS_ROOT, true);
                this.set_flag(EFLAG_IN_ELEMENTS_ROOT, false);
                if (set_to_group) {
                    world.add_to_scene(this.group);
                } else {
                    world.add_to_scene(this.mesh);
                }
            }

            if (this.are_flags_on_and_off_respectively(EFLAG_IS_ROOT, EFLAG_IN_ELEMENTS_ROOT)) {
                world.add_element_root(this);
            }
            //if (this.are_flags_on_and_off_respectively(EFLAG_INTERACTIVE, EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            //    world.add_element_interactive(this);
            //}
        },

        refresh: function() {
            this.get_object().updateMatrix();
        },

        set_to_looked_at: function() {
            this.mesh.userData[IS_CURRENTLY_LOOKED_AT] = true;
            this.set_flag(EFLAG_BEING_LOOKED_AT, true);
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.manager_renderer.outline_glow.set_hover_object(this.get_object());
            }
        },

        set_to_looked_away: function() {
            this.mesh.userData[IS_CURRENTLY_LOOKED_AT] = false;
            this.set_flag(EFLAG_BEING_LOOKED_AT, false);
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.manager_renderer.outline_glow.remove_hover_object(this.get_object());
            }
        },

        set_to_engaged: function() {
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.manager_renderer.outline_glow.set_to_engage_color();
            }
            this.set_flag(EFLAG_ENGAGED, true);
        },

        set_to_disengaged: function() {
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.manager_renderer.outline_glow.set_to_hover_color();
            }
            this.set_flag(EFLAG_ENGAGED, false);
        },

        _remove_from_scene: function() {
            if (this.group != null) {
                this.group.remove(this.mesh);
            } else {
                this.world.remove_object_from_scene(this.mesh);
            }
        },

        _add_to_scene: function() {
            if (this.group != null) {
                this.group.add(this.mesh);
            } else {
                this.world.add_object_to_scene(this.mesh);
            }
        },
    }
);