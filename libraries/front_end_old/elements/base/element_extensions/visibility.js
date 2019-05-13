Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    {
        _set_children_visibility: function(is_visible) {
            if (this.group !== null) {
                this.group.visible = is_visible;
                // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
                this.group.traverse (function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.visible = is_visible;
                        if (child.userData[USER_DATA_KEY_PARENT_OBJECT] !== null) {
                            if (is_visible) {
                                child.userData[USER_DATA_KEY_PARENT_OBJECT].flag_set_on(EFLAG_IS_VISIBLE);
                            } else {
                                child.userData[USER_DATA_KEY_PARENT_OBJECT].flag_set_off(EFLAG_IS_VISIBLE);
                            }
                        }
                    }
                });
            } else {
                this.mesh.visible = is_visible;
            }
        },

        set_to_visible: function() {
            if (this.flag_is_off(EFLAG_IS_VISIBLE)) {
                this._set_children_visibility(true);
                this.flag_set_on(EFLAG_IS_VISIBLE);
            }
        },

        set_to_invisible: function() {
            if (this.flag_is_on(EFLAG_IS_VISIBLE)) {
                this._set_children_visibility(false);
                this.flag_set_off(EFLAG_IS_VISIBLE);
            }
        },
    }
);
