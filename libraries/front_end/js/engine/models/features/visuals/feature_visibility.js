'use strict';

$_QE.prototype.FeatureVisibility = function() {

    // States.
    this.currently_visible = true;
    // If this variable is set to to 'true' then calls to 'display_all_attachments_recursively' will not affect this Visibility object.
    this.manual_visibility = false;

    this.is_visible = function() {
        return this.currently_visible;
    };

    this._set_visibility_of_object = function(obj, is_visible, force) {
        if (force) {
            obj.visible = is_visible;
        } else {
            if (obj.userData != null) {
                if (obj.userData.manual_visibility != null) {
                    if (!obj.userData.manual_visibility) {
                        obj.visible = is_visible;
                    }
                } else {
                    obj.visible = is_visible;
                }
            } else {
                obj.visible = is_visible;
            }
        }

    };

    this._set_to_visible = function(is_visible, force) {
        this.currently_visible = is_visible;
        this._set_visibility_of_object(this.object3D, is_visible, force);
        let f = this._set_visibility_of_object;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                f(child, is_visible, force);
                //this._set_visibility_of_object(child, is_visible, force);
            }
        });
    };

    this.set_to_visible = function(force) {
        this._set_to_visible(true, force);
    };

    this.set_to_invisible = function(force) {
        this._set_to_visible(false, force);
    };

    /*__   ___  __          __   ___  __          ___ ___       __              ___      ___  __  
     |__) |__  /  \ |  | | |__) |__  /__`     /\   |   |   /\  /  ` |__|  |\/| |__  |\ |  |  /__` 
     |  \ |___ \__X \__/ | |  \ |___ .__/    /~~\  |   |  /~~\ \__, |  |  |  | |___ | \|  |  .__/ */

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

    this.display_all_child_attachments_with_name = function(n) {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].relative_name === n) {
                this.attachments[a].set_to_visible();
            }
        }
    };

    this.hide_all_child_attachments_with_name = function(n) {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].relative_name === n) {
                this.attachments[a].set_to_invisible();
            }
        }
    };

};

