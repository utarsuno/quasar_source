'use strict';

function Animatable() {

    // TODO : Eventually change the design so not every instance requires a tracking of delta.

    this.animation_time = null;
    this.has_animation = false;
    this.requires_animation_update = false;

    this.attached_to_player = false;

    this._elapsed_delta = 0;
    this.percentage_elapsed = 0;

    this._restart_animation = function() {
        this.requires_animation_update = true;
        this._elapsed_delta = 0;
        this.percentage_elapsed = 0;

        if (this.attached_to_player) {
            var player_position = CURRENT_PLAYER.get_position();
            var player_normal = CURRENT_PLAYER.get_direction();

            this.animation_start_position_x = player_position.x;
            this.animation_start_position_y = player_position.y;
            this.animation_start_position_z = player_position.z;

            this.animation_offset = this.get_animation_total_offset(player_normal);
        } else {
            // TODO : 
            l('TODO : Enable normal animations too!');
        }
    };

    this.update = function(delta) {
        this._elapsed_delta += delta;
        if (this._elapsed_delta >= this.animation_time) {
            this.percentage_elapsed = 1.0;
        } else {
            this.percentage_elapsed = this._elapsed_delta / this.animation_time;
            this.requires_animation_update = false;
        }

        this.set_position(this.animation_start_position_x + this.animation_offset[0] * this.percentage_elapsed,
            this.animation_start_position_y + this.animation_offset[1] * this.percentage_elapsed,
            this.animation_start_position_z + this.animation_offset[2] * this.percentage_elapsed, true);
    };

    this.update_all_child_animations_recursively = function(delta) {
        for (var a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].has_animation && this.attachments[a].requires_animation_update) {
                this.attachments[a].update(delta);
            }
            this.attachments[a].update_all_child_animations_recursively(delta);
        }
    };

    this.set_animation_horizontal_offset = function(distance_offset, parent_width_percentage_offset) {
        if (!this.has_animation) {
            this.has_animation = true;
        }
        this.animation_horizontal_distance                = distance_offset;
        this.animation_horizontal_parent_width_percentage = parent_width_percentage_offset;
    };

    this.set_animation_vertical_offset = function(distance_offset, parent_height_percentage_offset) {
        if (!this.has_animation) {
            this.has_animation = true;
        }
        this.animation_vertical_distance                 = distance_offset;
        this.animation_vertical_parent_height_percentage = parent_height_percentage_offset;
    };

    this.set_animation_depth_offset = function(depth_offset) {
        if (!this.has_animation) {
            this.has_animation = true;
        }
        this.animation_normal_distance = depth_offset;
    };

    // WARNING : This is recursive. Change the design later.
    this.restart_all_animations = function() {
        if (this.has_animation) {
            this._restart_animation();
        }
        for (var a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].has_animation) {
                this.attachments[a]._restart_animation();
            }
            this.attachments[a].restart_all_animations();
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_animation_total_offset = function(n) {
        var normal;
        if (is_defined(n)) {
            normal = n;
        } else {
            normal = this.get_normal();
        }
        var dx = 0;
        var dy = 0;
        var dz = 0;
        var d;
        if (is_defined(this.animation_horizontal_distance)) {
            d = this.get_horizontal_shift(this.animation_horizontal_distance);
            dx += d.x;
            dy += d.y;
            dz += d.z;
        }
        if (is_defined(this.animation_horizontal_parent_width_percentage)) {
            d = this.get_horizontal_shift(this.attachment_parent.width * this.animation_horizontal_parent_width_percentage);
            dx += d.x;
            dy += d.y;
            dz += d.z;
        }
        // TODO : WARNING : For now this only supports y-normals of 0.
        if (is_defined(this.animation_vertical_distance)) {
            dy += this.animation_vertical_distance;
        }
        if (is_defined(this.animation_vertical_parent_height_percentage)) {
            dy += this.animation_vertical_parent_height_percentage * this.attachment_parent.height;
        }
        if (is_defined(this.animation_normal_distance)) {
            dx += normal.x * this.offset_normal_distance;
            dy += normal.y * this.offset_normal_distance;
            dz += normal.z * this.offset_normal_distance;
        }
        return [dx, dy, dz];
    };

}