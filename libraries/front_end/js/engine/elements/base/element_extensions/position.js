'use strict';

Object.assign($_QE.prototype.FloatingElement.prototype, {

    // State.

    set_to_update_needed_for_position: function() {
        this.set_flag(EFLAG_UPDATE_POSITION, true);
        if (this.is_relative()) {
            this.attachment_parent.set_flag(EFLAG_UPDATE_CHILD, true);
        }
    },

    set_to_absolute_position: function() {
        this.position_offsets = undefined;

        this._cache_previous_position_center_x         = null;
        this._cache_previous_position_center_y         = null;
        this._cache_previous_position_center_z         = null;
        this._cache_previous_position_center_look_at_x = null;
        this._cache_previous_position_center_look_at_y = null;
        this._cache_previous_position_center_look_at_z = null;
    },

    set_to_relative_position: function() {
        // First 3 offsets are horizontal, last 3 offsets are vertical.
        this.position_offsets = new Float64Array(6);

        this._cache_previous_position_center_x         = undefined;
        this._cache_previous_position_center_y         = undefined;
        this._cache_previous_position_center_z         = undefined;
        this._cache_previous_position_center_look_at_x = undefined;
        this._cache_previous_position_center_look_at_y = undefined;
        this._cache_previous_position_center_look_at_z = undefined;
    },

    // For both relative and absolute positions.

    get_world_position: function() {
        if (this.is_relative()) {
            // TEMP:
            this.mesh.geometry.computeBoundingBox();
            let box = this.mesh.geometry.boundingBox;
            let position = new THREE.Vector3();
            position.subVectors(box.max, box.min);
            position.multiplyScalar(0.5);
            position.add(box.min);
            position.applyMatrix4(this.mesh.matrixWorld);
            return position;
        }
        // Absolute position.
        return this.get_object().position;
    },


    // For absolute positions.

    set_position: function(x, y, z) {
        this.get_object().position.set(x, y, z);
        this._set_position_needs_update();
    },

    set_position_center: function(x, y, z, look_at_x, look_at_y, look_at_z, cache=false) {
        if (cache) {
            this._cache_previous_position_center_x         = x;
            this._cache_previous_position_center_y         = y;
            this._cache_previous_position_center_z         = z;
            this._cache_previous_position_center_look_at_x = look_at_x;
            this._cache_previous_position_center_look_at_y = look_at_y;
            this._cache_previous_position_center_look_at_z = look_at_z;
        }

        this.get_object().position.set(x, y - this.height / 2, z);
        this.get_object().updateMatrix();

        if (cache) {
            this.look_at(look_at_x, look_at_y, look_at_z);
            this.re_cache_normal();
            this.shift_by_left_right(this.width / 2);
        } else {
            if (this.group == null) {
                this.look_at(look_at_x, look_at_y, look_at_z);
                this.re_cache_normal();
            }
            this.shift_by_left_right(this.width / 2);
        }
        this._set_position_needs_update();
    },

    shift_by_left_right: function(distance) {
        if (this.group != null) {
            this.group.position.set(
                this.group.position.x + this._cache_absolute_left_right.x * distance,
                this.group.position.y,
                this.group.position.z + this._cache_absolute_left_right.z * distance
            );
        } else {
            this.mesh.position.set(
                this.mesh.position.x + this._cache_absolute_left_right.x * distance,
                this.mesh.position.y,
                this.mesh.position.z + this._cache_absolute_left_right.z * distance
            );
        }
        this._set_position_needs_update();
    },

    // For relative positions.
    _set_position_needs_update: function() {
        this.set_flag(EFLAG_UPDATE_POSITION, true);
        this._set_parent_chain_to_update_children();
    },

    _set_parent_chain_to_update_children: function() {
        if (this.attachment_parent == null) {
            return;
        } else if (this.attachment_parent.set_flag != null) {
            this.attachment_parent.set_flag(EFLAG_UPDATE_CHILD, true);
        } else if (this.parent_button != null) {
            this.parent_button._set_parent_chain_to_update_children();
        }
    },

    set_offset_vertical: function(parent_percentage, self_percentage=null, distance=null) {
        this.position_offsets[3] = parent_percentage;
        if (self_percentage != null) {
            this.position_offsets[4] = self_percentage;
        }
        if (distance != null) {
            this.position_offsets[5] = distance;
        }
        if (this.group != null) {
            this.group.position.y = this.attachment_parent.height * (this.position_offsets[3] - 0.5) + this.height * this.position_offsets[4];
        } else {
            this.mesh.position.y  = this.attachment_parent.height * (this.position_offsets[3] - 0.5) + this.height * this.position_offsets[4];
        }
        this._set_position_needs_update();
    },

    set_offset_horizontal: function(parent_percentage, self_percentage=null, distance=null) {
        this.position_offsets[0] = parent_percentage;
        if (self_percentage != null) {
            this.position_offsets[1] = self_percentage;
        }
        if (distance != null) {
            this.position_offsets[2] = distance;
        }
        if (this.group != null) {
            this.group.position.x = this.attachment_parent.width * (this.position_offsets[0] - 0.5) + this.width * this.position_offsets[1] + this.position_offsets[2];
        } else {
            this.mesh.position.x  = this.attachment_parent.width * (this.position_offsets[0] - 0.5) + this.width * this.position_offsets[1] + this.position_offsets[2];
        }
        this._set_position_needs_update();
    },

    set_offset_depth: function(distance) {
        if (this.group != null) {
            this.group.position.z += distance;
        } else {
            this.mesh.position.z += distance;
        }
        this._set_position_needs_update();
    },
});
