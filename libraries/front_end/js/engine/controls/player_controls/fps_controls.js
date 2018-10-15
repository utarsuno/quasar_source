'use strict';

Object.assign($_QE.prototype.Player.prototype, {
    //
    _velocity               : new THREE.Vector3(),
    _position_frame_previous: new THREE.Vector3(),
    _position_frame_target  : new THREE.Vector3(),
    //
    _movement_speed: 27.5,
    _decay         : 0.025,
    //this._decay_inverse  = 1.0 - this._decay;
    _decay_inverse : 0.55,
    // Cache.
    _magnitude                      : null,
    _magnitude_with_diagonal_penalty: null,
    //

    instant_teleport_to_xyz: function(x, y, z) {
        this.yaw.position.set(x, y, z);
        this._position_frame_previous.set(x, y, z);
        this._position_frame_target.set(x, y, z);
    },

    set_position_xyz: function(x, y, z) {
        this.reset_velocity();
        this.yaw.position.set(x, y, z);
        this._position_frame_previous.set(x, y, z);
        this._position_frame_target.set(x, y, z);
    },

    set_position: function(v) {
        this.reset_velocity();
        this.yaw.position.set(v.x, v.y, v.z);
        this._position_frame_previous.set(v.x, v.y, v.z);
        this._position_frame_target.set(v.x, v.y, v.z);
    },

    move_along_normal: function(magnitude) {
        this._velocity.x += magnitude * this._cache_normal.x;
        this._velocity.y += magnitude * this._cache_normal.y;
        this._velocity.z += magnitude * this._cache_normal.z;
    },

    move_along_left_right: function(magnitude) {
        this._velocity.x += magnitude * this._cache_left_right.x;
        this._velocity.z += magnitude * this._cache_left_right.z;
    },

    reset_velocity: function() {
        this._velocity.set(0, 0, 0);
    },

    physics: function(delta) {
        this.update_mouse_view();

        this._magnitude                       = this._movement_speed;
        this._magnitude_with_diagonal_penalty = this._magnitude * DIAGONAL_PENALTY;

        // Add to position.
        this._position_frame_target.add(this._velocity);

        this._position_frame_previous.lerp(this._position_frame_target, this._decay_inverse);

        this.yaw.position.set(this._position_frame_previous.x, this._position_frame_previous.y, this._position_frame_previous.z);

        let decay = Math.pow(this._decay, 1);
        this._velocity.x *= decay;
        this._velocity.y *= decay;
        this._velocity.z *= decay;

        // TODO: Detect when movement is done.
        this.yaw.updateMatrix();
        this.pitch.updateMatrix();

        if (!this.has_movement()) {
            return;
        }

        if (this.input_manager.key_down_space) {
            this._velocity.y += this._magnitude;
        }
        if (this.input_manager.key_down_shift) {
            this._velocity.y -= this._magnitude;
        }

        if ((this.input_manager.key_down_up ^ this.input_manager.key_down_down) & (this.input_manager.key_down_left ^ this.input_manager.key_down_right)) {
            if (this.input_manager.key_down_up) {
                this.move_along_normal(this._magnitude_with_diagonal_penalty);
            } else {
                this.move_along_normal(-this._magnitude_with_diagonal_penalty);
            }
            if (this.input_manager.key_down_left) {
                this.move_along_left_right(-this._magnitude_with_diagonal_penalty);
            } else {
                this.move_along_left_right(this._magnitude_with_diagonal_penalty);
            }
        } else if (this.input_manager.key_down_up ^ this.input_manager.key_down_down) {
            if (this.input_manager.key_down_up) {
                this.move_along_normal(this._magnitude);
            } else {
                this.move_along_normal(-this._magnitude);
            }
        } else if (this.input_manager.key_down_left ^ this.input_manager.key_down_right) {
            if (this.input_manager.key_down_left) {
                this.move_along_left_right(-this._magnitude);
            } else {
                this.move_along_left_right(this._magnitude);
            }
        }
    },

    get_position: function(vector=null) {
        if (vector != null) {
            vector.set(
                this.yaw.position.x,
                this.yaw.position.y,
                this.yaw.position.z
            );
        } else {
            return this.yaw.position;
        }
    },

    get_velocity: function() {
        //return this.velocity;
    },
});
