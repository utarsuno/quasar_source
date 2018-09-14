'use strict';

$_QE.prototype.FeaturePosition = function() {

    this.update_needed_for_position                = false;

    this._cache_previous_position_center_x         = null;
    this._cache_previous_position_center_y         = null;
    this._cache_previous_position_center_z         = null;
    this._cache_previous_position_center_look_at_x = null;
    this._cache_previous_position_center_look_at_y = null;
    this._cache_previous_position_center_look_at_z = null;

    this.set_position = function(x, y, z) {
        //this.mesh.position.set(x, y, z);
        if (this.group != null) {
            this.group.position.set(x, y, z);
        } else {
            this.mesh.position.set(x, y, z);
        }
        this.update_needed_for_position = true;
    };

    this.shift_by_left_right = function(distance) {
        if (this.group != null) {
            this.group.position.set(
                this.group.position.x + this._cache_relative_left_right.x * distance,
                this.group.position.y,
                this.group.position.z + this._cache_relative_left_right.z * distance
            );
        } else {
            this.mesh.position.set(
                this.mesh.position.x + this._cache_relative_left_right.x * distance,
                this.mesh.position.y,
                this.mesh.position.z + this._cache_relative_left_right.z * distance
            );
        }
    };

    this.set_position_center = function(x, y, z, look_at_x, look_at_y, look_at_z, cache=false) {

        if (cache) {
            this._cache_previous_position_center_x = x;
            this._cache_previous_position_center_y = y;
            this._cache_previous_position_center_z = z;
            this._cache_previous_position_center_look_at_x = look_at_x;
            this._cache_previous_position_center_look_at_y = look_at_y;
            this._cache_previous_position_center_look_at_z = look_at_z;

            

        }

        if (this.group != null) {
            this.group.position.set(
                x,
                y - this.height / 2,
                z
            );
        } else {
            this.mesh.position.set(
                x,
                y - this.height / 2,
                z
            );
        }

        this.look_at(look_at_x, look_at_y, look_at_z);

        //this.re_cache_normal();
        if (cache) {
            this.re_cache_normal();
        }

        l('Shifting left right by {' + (this.width / 2) + '}');
        this.shift_by_left_right(this.width / 2);

        this.update_needed_for_position = true;
    };
};