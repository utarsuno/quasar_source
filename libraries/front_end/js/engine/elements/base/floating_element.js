'use strict';

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

        update_element: function() {
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

            // TODO: check if sub-children need update

            //this.consume_flag(EFLAG_UPDATE_CHILD)

            if (this.parent_button != null) {
                l('Confimration promtp!');
                l(this.get_flag(EFLAG_UPDATE_CHILD));
            }

            //if (this._node_head != null) {
            //    l('THIS ELEMENT HAS A NODE HEAD!');
            //}

            if (this.get_flag(EFLAG_UPDATE_CHILD)) {
                let c;
                for (c = 0; c < this.attachments.length; c++) {
                    this.attachments[c].update_element();
                }
                this.set_flag(EFLAG_UPDATE_CHILD, false);
            }

            // Children need to be checked for EFLAG_UPDATE_CHILD
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


