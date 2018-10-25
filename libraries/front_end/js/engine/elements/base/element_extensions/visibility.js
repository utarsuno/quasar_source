'use strict';

Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    {
        is_visible: function() {
            return this.get_flag(EFLAG_VISIBLE);
        },

        _set_to_visible: function() {
            if (this.group != null) {
                this.group.visible = true;
                // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
                this.group.traverse (function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.visible = true;
                    }
                });
            } else {
                this.mesh.visible = true;
            }
        },

        _set_to_invisible: function() {
            if (this.group != null) {
                this.group.visible = false;
                // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
                this.group.traverse (function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.visible = false;
                    }
                });
            } else {
                this.mesh.visible = false;
            }
        },

        set_to_visible: function() {
            if (!this.get_flag(EFLAG_VISIBLE)) {
                this._set_to_visible();
                this.set_flag(EFLAG_VISIBLE, true);
            } else {
                // TODO: Formalize/abstract warnings logging.
                l('WARNING: set_to_visible called on visible object!');
                l(this);
            }
        },

        set_to_invisible: function() {
            if (this.get_flag(EFLAG_VISIBLE)) {
                this._set_to_invisible();
                this.set_flag(EFLAG_VISIBLE, false);
            } else {
                l('WARNING: set_to_invisible called on invisible object!');
                l(this);
            }
        },
    }
);


/*    __   ___  __          __   ___  __          ___ ___       __              ___      ___  __
     |__) |__  /  \ |  | | |__) |__  /__`     /\   |   |   /\  /  ` |__|  |\/| |__  |\ |  |  /__`
     |  \ |___ \__X \__/ | |  \ |___ .__/    /~~\  |   |  /~~\ \__, |  |  |  | |___ | \|  |  .__/
    this.display_self_and_all_child_attachments_recursively = function() {
        this.set_to_visible(false);
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (!this.attachments[a].manual_visibility) {
                this.attachments[a].display_self_and_all_child_attachments_recursively();
            }
        }
    };

    this.force_display_self_and_all_child_attachments_recursively = function() {
        this.set_to_visible(true);
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].force_display_self_and_all_child_attachments_recursively();
        }
    };

    this.hide_self_and_all_child_attachments_recursively = function() {
        this.set_to_invisible(false);
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (!this.attachments[a].manual_visibility) {
                this.attachments[a].hide_self_and_all_child_attachments_recursively();
            }
        }
    };

    this.force_hide_self_and_all_child_attachments_recursively = function() {
        this.set_to_invisible(true);
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].force_hide_self_and_all_child_attachments_recursively();
        }
    };
*/