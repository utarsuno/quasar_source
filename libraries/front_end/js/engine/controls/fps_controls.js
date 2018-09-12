'use strict';

$_QE.prototype.FPSControls = function() {
    this.camera = this.engine.manager_renderer.camera;
    //
    $_QE.prototype.MouseControls.call(this);

    //
    this._velocity                = new THREE.Vector3();
    this._position_frame_previous = new THREE.Vector3();
    this._position_frame_target   = new THREE.Vector3();
    //
    this._movement_speed = 27.5;
    this._decay          = 0.025;
    //this._decay_inverse  = 1.0 - this._decay;
    this._decay_inverse  = 0.55;
    // Cache.
    this._magnitude                       = null;
    this._magnitude_with_diagonal_penalty = null;
    //

    this.set_position_xyz = function(x, y, z) {
        this.reset_velocity();
        this.yaw.position.set(x, y, z);
        this._position_frame_previous.set(x, y, z);
        this._position_frame_target.set(x, y, z);
    };

    this.set_position = function(v) {
        this.reset_velocity();
        this.yaw.position.set(v.x, v.y, v.z);
        this._position_frame_previous.set(v.x, v.y, v.z);
        this._position_frame_target.set(v.x, v.y, v.z);
    };

    this.move_along_normal = function(magnitude) {
        this._velocity.x += magnitude * this._cache_normal.x;
        this._velocity.y += magnitude * this._cache_normal.y;
        this._velocity.z += magnitude * this._cache_normal.z;
    };

    this.move_along_left_right = function(magnitude) {
        this._velocity.x += magnitude * this._cache_left_right.x;
        this._velocity.z += magnitude * this._cache_left_right.z;
    };

    this.reset_velocity = function() {
        this._velocity.set(0, 0, 0);
    };

    this.physics = function(delta) {
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
    };

    this.get_position = function() {
        return this.yaw.position;
    };

    this.get_velocity = function() {
        //return this.velocity;
    };

};

