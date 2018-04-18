'use strict';

function _set_visibility_of_object(obj, is_visible, force) {
    if (force) {
        obj.visible = is_visible;
    } else {
        if (is_defined(obj.userData)) {
            if (is_defined(obj.userData.manual_visibility)) {
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

}

function Visibility() {

    // States.
    this.currently_visible = true;
    // If this variable is set to to 'true' then calls to 'display_all_attachments_recursively' will not affect this Visibility object.
    this.manual_visibility = false;

    this.is_visible = function() {
        return this.currently_visible;
    };

    this._set_to_visible = function(is_visible, force) {
        this.currently_visible = is_visible;
        _set_visibility_of_object(this.object3D, is_visible, force);
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                _set_visibility_of_object(child, is_visible, force);
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
        for (var a = 0; a < this.attachments.length; a++) {
            if (!this.attachments[a].manual_visibility) {
                this.attachments[a].display_self_and_all_child_attachments_recursively();
            }
        }
    };

    this.force_display_self_and_all_child_attachments_recursively = function() {
        this.set_to_visible(true);
        for (let a = 0; a < this.attachments.length; a++) {
            this.attachments[a].force_display_self_and_all_child_attachments_recursively();
        }
    };

    this.hide_self_and_all_child_attachments_recursively = function() {
        this.set_to_invisible(false);
        for (let a = 0; a < this.attachments.length; a++) {
            if (!this.attachments[a].manual_visibility) {
                this.attachments[a].hide_self_and_all_child_attachments_recursively();
            }
        }
    };

    this.force_hide_self_and_all_child_attachments_recursively = function() {
        this.set_to_invisible(true);
        for (let a = 0; a < this.attachments.length; a++) {
            this.attachments[a].force_hide_self_and_all_child_attachments_recursively();
        }
    };

    this.display_all_child_attachments_with_name = function(n) {
        for (let a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].relative_name === n) {
                this.attachments[a].set_to_visible();
            }
        }
    };

    this.hide_all_child_attachments_with_name = function(n) {
        for (let a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].relative_name === n) {
                this.attachments[a].set_to_invisible();
            }
        }
    };

}
