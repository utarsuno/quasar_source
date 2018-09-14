'use strict';

$_QE.prototype.FeaturePosition = function() {

    this.update_needed_for_position = false;

    this.set_position = function(x, y, z) {
        this.mesh.position.set(x, y, z);
        this.update_needed_for_position = true;
    };

    this.shift_by_left_right = function(distance) {
        this.mesh.position.set(
            this.mesh.position.x + this._cache_relative_left_right.x * distance,
            this.mesh.position.y,
            this.mesh.position.z + this._cache_relative_left_right.z * distance
        );
    };

    this.set_position_center = function(x, y, z, look_at_x, look_at_y, look_at_z) {
        // TODO: This requires either a normal or a look at position!!!
        this.mesh.position.set(
            x,
            y - this.height / 2,
            z
        );

        this.look_at(look_at_x, look_at_y, look_at_z);

        this.re_cache_normal();

        l('Shifting left right by {' + (this.width / 2) + '}');
        this.shift_by_left_right(this.width / 2);

        this.update_needed_for_position = true;
    };
};