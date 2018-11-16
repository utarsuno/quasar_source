'use strict';

// Button features to add back in!
/*
   this.has_button_state = false;

    this.set_button_engage_function = function(engage_function) {
        if (engage_function != null) {
            this.button_engage_function = engage_function;
            this.set_engage_function(this.try_to_perform_engage_function.bind(this));
        }
    };

    this.add_button_state = function() {
        if (!this.has_button_state) {
            ButtonState.call(this);
            this.has_button_state = true;
        }
    };

    this.try_to_perform_engage_function = function() {
        if (this.has_button_state) {
            if (this.enabled()) {
                this.button_engage_function();
            }
        } else {
            this.button_engage_function();
        }
    };
 */

$_QE.prototype.FloatingElement = function() {};

Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.Element.prototype,
    $_QE.prototype.FeatureGeometry.prototype,
    $_QE.prototype.FeatureMaterial.prototype,
    $_QE.prototype.FeatureMesh.prototype,
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

        update_element: function(delta) {
            // TODO: Why is only position consumed?
            if (this.consume_flag(EFLAG_UPDATE_POSITION) || this.get_flag(EFLAG_UPDATE_NORMAL)) {
                this.refresh();

                if (!this.is_relative()) {
                    this.re_cache_normal();
                }
            }

            // TODO: set this to an event!
            if (this.update != null) {
                this.update();
            }

            if (this.get_flag(EFLAG_IN_ANIMATION)) {
                this.animation_step(delta);
            }

            // TODO: Temporary, lower performance for less bugs.
            let c;
            for (c = 0; c < this.attachments.length; c++) {
                this.attachments[c].update_element(delta);
            }

            /*
            // TODO: Optimize later.
            let c;
            if (this.get_flag(EFLAG_UPDATE_CHILD)) {
                for (c = 0; c < this.attachments.length; c++) {
                    this.attachments[c].update_element();
                }
                this.set_flag(EFLAG_UPDATE_CHILD, false);
            } else {
                for (c = 0; c < this.attachments.length; c++) {
                    if (this.attachments[c].get_flag(EFLAG_UPDATE_CHILD)) {
                        this.attachments[c].update_element();
                    }
                }
            }
            */

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


