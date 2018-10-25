'use strict';

$_QE.prototype.FloatingElement = function() {};

Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.Element.prototype,
    {
        initialize_floating_element_data: function() {
            this.initialize_element_data();
            this.attachments       = [];
            this.attachment_parent = null;
        },

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

        refresh: function() {
            this.get_object().updateMatrix();
        },

        set_to_looked_at: function() {
            this.mesh.userData[IS_CURRENTLY_LOOKED_AT] = true;
            this.set_flag(EFLAG_BEING_LOOKED_AT, true);
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.set_hover_object(this.get_object());
            }
        },

        set_to_looked_away: function() {
            this.mesh.userData[IS_CURRENTLY_LOOKED_AT] = false;
            this.set_flag(EFLAG_BEING_LOOKED_AT, false);
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.remove_hover_object(this.get_object());
            }
        },

        set_to_engaged: function() {
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.set_to_engage_color();
            }
            this.set_flag(EFLAG_ENGAGED, true);
        },

        set_to_disengaged: function() {
            if (this.get_flag(EFLAG_OUTLINE_GLOW)) {
                QE.set_to_hover_color();
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