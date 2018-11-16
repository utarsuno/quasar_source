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
            }
        },

        set_to_invisible: function() {
            if (this.get_flag(EFLAG_VISIBLE)) {
                this._set_to_invisible();
                this.set_flag(EFLAG_VISIBLE, false);
            }
        },
    }
);
