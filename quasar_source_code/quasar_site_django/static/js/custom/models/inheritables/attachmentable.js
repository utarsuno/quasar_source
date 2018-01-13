'use strict';

const ATTACHMENT_NAME_WARNING = 1;
const ATTACHMENT_NAME_SUCCESS = 2;
const ATTACHMENT_NAME_ERROR   = 3;


const ATTACHMENT_TYPE_FLOATING_WALL = 5;


function Attachmentable() {

    // All attachments will inherit Attachmentable.
    this.attachments = [];

    // The current object that has this instance as an attachment.
    this.attachment_parent = null;
    // The parent of this entire attachmentable chain.
    this.root_parent = null;
    // Positive is towards the right and negative is towards left. Left and right are determined from the attached object's normal vector.
    this.relative_horizontal_offset = null;
    // Positive is up and negative is down. Up and down are determined from the attached object's normal vector.
    this.relative_vertical_offset = null;
    // Positive depth is away from the attached object's position (direction is the normal vector).
    this.relative_depth_offset = null;
    // A name given to find this attachment later.
    this.relative_name = null;
    // The class type.
    this.relative_type = null;

    this.add_attachment = function(attachment) {
        this.attachments.push(attachment);
        attachment.attachment_parent = this;
        if (this.root_parent === null) {
            attachment.root_parent = this;
        } else {
            attachment.root_parent = this.root_parent;
        }
    };

    this.update_all_attachments = function() {
        // TODO : Change the logic on this function! It needs to do breadth first, not depth first
        var all_attachments = this._get_all_attachments_recursively();
        for (var a = 0; a < all_attachments.length; a++) {
            all_attachments[a]._update_this_attachment_child();
        }
    };

    // This function should only be called on a root element.
    this.set_normal = function(x, y, z, refresh) {
        this.normal_updated = true;

        this.normal = new THREE.Vector3(x, y, z);
        this.normal.normalize();

        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.normal);
        this.left_right.normalize();

        if (refresh) {
            this.object3D.lookAt(new THREE.Vector3(this.object3D.position.x + this.normal.x * 100, this.object3D.position.y + this.normal.y * 100, this.object3D.position.z + this.normal.z * 100));
        }

        var all_attachments = this._get_all_attachments_recursively();
        for (var a = 0; a < all_attachments.length; a++) {
            all_attachments[a]._update_this_attachment_child();
        }
    };

    /*       __     __           ___
     \  / | /__` | |__) | |    |  |  \ /
      \/  | .__/ | |__) | |___ |  |   |  */
    this.display_all_attachments_recursively = function() {
        var all_attachments = this._get_all_attachments_recursively();
        for (var a = 0; a < all_attachments.length; a++) {
            if (!all_attachments[a].manual_visibility) {
                all_attachments[a].set_to_visible();
            }
        }
    };

    this.hide_all_attachments_recursively = function() {
        var all_attachments = this._get_all_attachments_recursively();
        for (var a = 0; a < all_attachments.length; a++) {
            if (!all_attachments[a].manual_visibility) {
                all_attachments[a].set_to_invisible();
            }
        }
    };

    this.display_all_attachments_with_name = function(n) {
        for (var a = 0; a < this.attachments.length; a++) {
            if (this.attachments.relative_name === n) {
                this.attachments[a].set_to_visible();
            }
        }
    };

    this.hide_all_attachments_with_name = function(n) {
        for (var a = 0; a < this.attachments.length; a++) {
            if (this.attachments.relative_name === n) {
                this.attachments[a].set_to_visible();
            }
        }
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_attachment_name = function(n) {
        this.relative_name = n;
    };

    this.set_attachment_horizontal_offset = function(d) {
        this.relative_horizontal_offset = d;
    };

    this.set_attachment_vertical_offset = function(d) {
        this.relative_vertical_offset = d;
    };

    this.set_attachment_depth = function(d) {
        this.relative_depth_offset = d;
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_horizontal_shift = function(distance) {
        return new THREE.Vector3(this.left_right.x * distance, this.left_right.y * distance, this.left_right.z * distance);
    };

    this.get_position = function() {
        return this.object3D.position;
    };

    this.get_normal = function() {
        if (this.is_root()) {
            return this.normal;
        }
        return this.root_parent.normal;
    };

    this.is_root = function() {
        return this.attachment_parent === null;
    };

    this._get_all_attachments_recursively = function() {
        var attachments = [];
        for (var a = 0; a < this.attachments.length; a++) {
            attachments.push(this.attachments[a]);
            var attachments_of_this_attachment = this.attachments[a].get_all_attachments_recursively();
            for (var aa = 0; aa < attachments_of_this_attachment.length; aa++) {
                attachments.push(attachments_of_this_attachment[aa]);
            }
        }
        return attachments;
    };

    /*      ___  ___  __                         ___          ___    ___  __
     | |\ |  |  |__  |__) |\ |  /\  |       |  |  |  | |    |  |  | |__  /__`
     | | \|  |  |___ |  \ | \| /~~\ |___    \__/  |  | |___ |  |  | |___ .__/ */

    this._update_this_attachment_child = function() {
        var parent_position = this.attachment_parent.object3D.position;



        //var x = this.attachment_parent.object3D.position.x;
        //var y = this.attachment_parent.object3D.position.y;
        //var z = this.attachment_parent.object3D.position.z;
        //var n_x = this.attachment_parent
    };
}


/*

'use strict';

function Visibility() {

    // States.
    this.currently_visible = true;

    this.is_visible = function() {
        return this.currently_visible;
    };

    this.set_to_visible = function() {
        this.currently_visible = true;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = true;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = true;
            }
        });
    };

    this.set_to_invisible = function() {
        this.currently_visible = false;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = false;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = false;
            }
        });
    };

}


 */