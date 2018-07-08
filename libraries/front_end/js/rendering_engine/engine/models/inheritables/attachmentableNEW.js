'use strict';

$_QE.prototype.Attachmentable = function() {

    // All attachments will inherit Attachmentable.
    this.attachments = [];

    // The current object that has this instance as an attachment.
    this.attachment_parent = null;
    // The parent of this entire attachmentable chain.
    this.root_parent = null;
    // A name given to find this attachment later.
    this.relative_name = null;


    this.add_floating_wall_attachment = function(width, height, horizontal_offset, vertical_offset, depth_offset, scalable) {
        let floating_wall;
        if (is_defined(scalable)) {
            // OLD : floating_wall = new FloatingWall(width, height, position, this.get_normal(), this.world, scalable);
            floating_wall = new FloatingWall(width, height, null, null, this.world, scalable);
        } else {
            floating_wall = new FloatingWall(width, height, null, null, this.world, false);
        }

        this.add_attachment(floating_wall);

        if (is_defined(horizontal_offset)) {
            floating_wall.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_wall.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_wall.set_attachment_depth_offset(depth_offset);
        }
        return floating_wall;
    };

    this.add_floating_element = function(horizontal_offset, vertical_offset, depth_offset, floating_element) {
        this.add_attachment(floating_element);
        if (is_defined(horizontal_offset)) {
            floating_element.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_element.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_element.set_attachment_depth_offset(depth_offset);
        }
        return floating_element;
    };

    // WARNING : This is recursive. Change the design later.
    this.update_all_child_attachments = function() {
        let parent_position = this.get_position();

        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].set_position(parent_position.x, parent_position.y, parent_position.z, false);
            this.attachments[a]._refresh_look_at();

            if (this.attachments[a].manual_positioning) {
                this.attachments[a].object3D.updateMatrix();
                this.attachments[a].object3D.matrixWorldNeedsUpdate = true;
            }

            if (this.attachments.length > 0) {
                this.attachments[a].update_all_child_attachments();
            }
        }
    };

    /*    ___ ___       __               __
      /\   |   |   /\  /  ` |__| | |\ | / _`
     /~~\  |   |  /~~\ \__, |  | | | \| \__> */
    this.is_attached = function() {
        return !(this.attachment_parent === null);
    };

    this.detach_from_parent = function() {
        if (is_defined(this.attachment_parent)) {
            let remove_index = -1;

            let a;
            for (a = 0; a < this.attachment_parent.attachments.length; a++) {
                if (this.attachment_parent.attachments[a] === this) {
                    remove_index = a;
                    break;
                }
            }

            if (remove_index !== NOT_FOUND) {
                this.attachment_parent.attachments.splice(remove_index, 1);
                this.attachment_parent = null;
            }
        }
    };

    this.attach_to = function(attachment_parent) {
        attachment_parent.add_attachment(this);
    };

    this.add_attachment = function(attachment) {
        this.attachments.push(attachment);
        if (this.is_root()) {
            attachment.root_parent = this;
        } else {
            attachment.root_parent = this.root_parent;
        }
        attachment.attachment_parent = this;

        if (this.manual_positioning) {
            attachment.set_to_manual_positioning();
            let a;
            for (a = 0; a < attachment.attachments.length; a++) {
                attachment.attachments[a].set_to_manual_positioning();
            }
        }
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_attachment_name = function(n) {
        this.relative_name = n;
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.has_attachment = function(attachment) {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a] === attachment) {
                return true;
            }
        }
        return false;
    };

    this.is_root = function() {
        return !is_defined(this.attachment_parent);
    };

    this._get_all_attachments_recursively = function() {
        let attachments = [];
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            attachments.push(this.attachments[a]);
            let attachments_of_this_attachment = this.attachments[a]._get_all_attachments_recursively();
            let aa;
            for (aa = 0; aa < attachments_of_this_attachment.length; aa++) {
                attachments.push(attachments_of_this_attachment[aa]);
            }
        }
        return attachments;
    };

};
