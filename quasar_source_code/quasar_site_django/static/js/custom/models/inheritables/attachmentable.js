'use strict';


function Attachmentable() {

    this.object3D = new THREE.Object3D();

    // All attachments will inherit Attachmentable.
    this.attachments = [];

    // The current object that has this instance as an attachment.
    this.attachment_parent = null;
    // The parent of this entire attachmentable chain.
    this.root_parent = null;
    // A name given to find this attachment later.
    this.relative_name = null;

    this.add_floating_wall_attachment = function(width, height, horizontal_offset, vertical_offset, depth_offset, scalable) {
        var position = new THREE.Vector3(this.object3D.position.x, this.object3D.position.y, this.object3D.position.z);
        var floating_wall;
        if (is_defined(scalable)) {
            floating_wall = new FloatingWall(width, height, position, this.normal, this.world, scalable);
        } else {
            floating_wall = new FloatingWall(width, height, position, this.normal, this.world, false);
        }
        if (is_defined(horizontal_offset)) {
            floating_wall.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_wall.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_wall.set_attachment_depth_offset(depth_offset);
        }
    };

    this.add_floating_2D_text = function(width, horizontal_offset, vertical_offset, depth_offset, text, type) {
        var floating_2D_text = new Floating2DText(width, text, type, this.world);
        if (is_defined(horizontal_offset)) {
            floating_2D_text.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_2D_text.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_2D_text.set_attachment_depth_offset(depth_offset);
        }
        return floating_2D_text;
    };

    // WARNING : This is recursive. Change the design later.
    this.update_all_child_attachments = function() {
        var parent_position = this.get_position();
        for (var a = 0; a < this.attachments.length; a++) {
            this.attachments[a].set_position(parent_position.x, parent_position.y, parent_position.z, false);
            this.attachments[a]._refresh_look_at();
            this.attachments[a].update_all_child_attachments();
        }
    };

    /*    ___ ___       __               __
      /\   |   |   /\  /  ` |__| | |\ | / _`
     /~~\  |   |  /~~\ \__, |  | | | \| \__> */
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
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.look_at_origin = function(refresh) {
        this.object3D.lookAt(-this.object3D.position.x, 0, -this.object3D.position.z);
        if (this.is_root()) {
            if (!is_defined(this.normal)) {
                var normal = new THREE.Vector3(-this.object3D.position.x, 0, -this.object3D.position.z);
                normal.normalize();
                this.normal = normal;
            }
        }
        if (refresh) {
            this._refresh_look_at();
        }
    };

    this.set_position = function(x, y, z, refresh) {
        if (this.is_root()) {
            this.object3D.position.set(x, y, z);
        } else {
            var position_offset = this.get_position_offset();
            this.object3D.position.set(x + position_offset.x, y + position_offset.y, z + position_offset.z);
        }
        if (refresh) {
            this._refresh_look_at();
            this.update_all_child_attachments();
        }
    };

    // This function should only be called on a root element.
    this.set_normal = function(x, y, z, refresh) {
        this.normal = new THREE.Vector3(x, y, z);
        this.normal.normalize();
        this.left_right = get_left_right_unit_vector(this.normal.x, this.normal.z);
        if (refresh) {
            this._refresh_look_at();
            this.update_all_child_attachments();
        }
    };

    this.set_attachment_name = function(n) {
        this.relative_name = n;
    };

    this.set_attachment_horizontal_offset = function(distance_offset, parent_width_percentage_offset) {
        this.offset_horizontal_distance                = distance_offset;
        this.offset_horizontal_parent_width_percentage = parent_width_percentage_offset;
    };

    this.set_attachment_vertical_offset = function(distance_offset, parent_height_percentage_offset) {
        this.offset_vertical_distance                 = distance_offset;
        this.offset_vertical_parent_height_percentage = parent_height_percentage_offset;
    };

    this.set_attachment_depth_offset = function(depth_offset) {
        this.offset_normal_depth_distance = depth_offset;
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_position_offset = function() {
        var normal = this.get_normal();
        var dx = 0;
        var dy = 0;
        var dz = 0;
        var d;
        if (is_defined(this.offset_horizontal_distance)) {
            d = this.get_horizontal_shift(this.offset_horizontal_distance);
            dx += d.x;
            dy += d.y;
            dz += d.z;
        }
        if (is_defined(this.offset_horizontal_parent_width_percentage)) {
            d = this.get_horizontal_shift(this.attachment_parent.width * this.offset_horizontal_parent_width_percentage);
            dx += d.x;
            dy += d.y;
            dz += d.z;
        }
        // TODO : WARNING : For now this only supports y-normals of 0.
        if (is_defined(this.offset_vertical_distance)) {
            dy += this.offset_vertical_distance;
        }
        if (is_defined(this.offset_vertical_parent_height_percentage)) {
            dy += this.offset_vertical_parent_height_percentage * this.attachment_parent.height;
        }
        if (is_defined(this.offset_normal_depth_distance)) {
            dx += normal.x * this.offset_normal_depth_distance;
            dy += normal.y * this.offset_normal_depth_distance;
            dz += normal.z * this.offset_normal_depth_distance;
        }
        return [dx, dy, dz];
    };

    this.get_horizontal_distance_to_center = function(x, z) {
        return sqrt(squared(x - this.object3D.position.x) + squared(z - this.object3D.position.z));
    };

    this.get_horizontal_shift = function(distance) {
        var left_right = this.get_left_right();
        return new THREE.Vector3(left_right.x * distance, left_right.y * distance, left_right.z * distance);
    };

    this.get_position = function() {
        return this.object3D.position;
    };

    // WARNING : This is recursive. Use different design later.
    this.get_normal = function() {
        if (is_defined(this.normal)) {
            return this.normal;
        } else {
            return this.attachment_parent.get_normal();
        }
    };

    // WARNING : This is recursive. Use different design later.
    this.get_left_right = function() {
        if (is_defined(this.left_right)) {
            return this.left_right;
        } else {
            return this.attachment_parent.get_left_right();
        }
    };

    this.is_root = function() {
        return !is_defined(this.attachment_parent);
    };

    this._get_all_attachments_recursively = function() {
        var attachments = [];
        for (var a = 0; a < this.attachments.length; a++) {
            attachments.push(this.attachments[a]);
            var attachments_of_this_attachment = this.attachments[a]._get_all_attachments_recursively();
            for (var aa = 0; aa < attachments_of_this_attachment.length; aa++) {
                attachments.push(attachments_of_this_attachment[aa]);
            }
        }
        return attachments;
    };

    /*      ___  ___  __                         ___          ___    ___  __
     | |\ |  |  |__  |__) |\ |  /\  |       |  |  |  | |    |  |  | |__  /__`
     | | \|  |  |___ |  \ | \| /~~\ |___    \__/  |  | |___ |  |  | |___ .__/ */
    this._refresh_look_at = function() {
        var normal = this.get_normal();
        this.object3D.lookAt(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
    };
}
