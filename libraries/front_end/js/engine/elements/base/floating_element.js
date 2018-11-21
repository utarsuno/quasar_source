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
    $_QE.prototype.FeatureSize.prototype,
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
            if (this.flag_is_on(EFLAG_IS_UPDATED_NEEDED_FOR_POSITION) || this.flag_is_on(EFLAG_IS_UPDATED_NEEDED_FOR_NORMAL)) {
                this.refresh();
                if (!this.is_relative()) {
                    this.re_cache_normal();
                }
                this.flag_set_off(EFLAG_IS_UPDATED_NEEDED_FOR_POSITION);
            }

            // TODO: set this to an event!
            if (this.update != null) {
                this.update();
            }

            if (delta != null) {
                this._update_element_animation(delta);

                // TODO: Temporary, lower performance for less bugs.
                this._update_attachments(delta);
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
            this._set_user_data_looked_at(true);
            this.flag_set_on(EFLAG_IS_BEING_LOOKED_AT);
            if (this.flag_is_on(EFLAG_IS_OUTLINE_GLOWABLE)) {
                QE.outline_glow_set_target(this.get_object());
            }
        },

        set_to_looked_away: function() {
            this._set_user_data_looked_at(false);
            this.flag_set_off(EFLAG_IS_BEING_LOOKED_AT);
            if (this.flag_is_on(EFLAG_IS_OUTLINE_GLOWABLE)) {
                QE.outline_glow_clear_target();
            }
        },

        set_to_engaged: function() {
            if (this.flag_is_on(EFLAG_IS_OUTLINE_GLOWABLE)) {
                QE.outline_glow_set_state_engaged();
            }
            this.flag_set_on(EFLAG_IS_ENGAGED);
        },

        set_to_disengaged: function() {
            if (this.flag_is_on(EFLAG_IS_OUTLINE_GLOWABLE)) {
                QE.outline_glow_set_state_hover();
            }
            this.flag_set_off(EFLAG_IS_ENGAGED);
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


