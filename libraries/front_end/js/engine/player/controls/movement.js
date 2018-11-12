'use strict';

//const DIAGONAL_PENALTY = 0.7071067811865476;
// _movement_diagonal = _movement_speed * DIAGONAL_PENALTY;

/*
Used cache indexes:
9 : current decay
10: movement_speed
11: movement_speed_diagonal
12: decay
13: decay_inverse
 */

Object.assign($_QE.prototype.Player.prototype, {
    _velocity               : new THREE.Vector3(),
    _position_frame_previous: new THREE.Vector3(),
    _position_frame_target  : new THREE.Vector3(),
    _update_player_matrix   : false,

    instant_teleport_to_xyz: function(x, y, z) {
        this.yaw.position.set(x, y, z);
        this._position_frame_previous.set(x, y, z);
        this._position_frame_target.set(x, y, z);
    },

    set_position_xyz: function(x, y, z) {
        this.reset_velocity();
        this.instant_teleport_to_xyz(x, y, z);
    },

    set_position: function(v) {
        this.set_position_xyz(v.x, v.y, v.z);
    },

    reset_velocity: function() {
        this._velocity.set(0, 0, 0);
    },

    _physics: function() {
        if (this.engine.key_down_space && !this.engine.key_down_shift) {
            this._velocity.y += this._cache[10];
        } else if (this.engine.key_down_shift && !this.engine.key_down_space) {
            this._velocity.y -= this._cache[10];
        }

        if ((this.engine.key_down_up ^ this.engine.key_down_down) & (this.engine.key_down_left ^ this.engine.key_down_right)) {
            // Move along normal.
            if (this.engine.key_down_up) {
                this._velocity.addScaledVector(this._cache_normal, this._cache[11]);
            } else {
                this._velocity.addScaledVector(this._cache_normal, -this._cache[11]);
            }
            // Move left-right.
            if (this.engine.key_down_left) {
                this._velocity.x += (-this._cache[11]) * this._cache_left_right.x;
                this._velocity.z += (-this._cache[11]) * this._cache_left_right.z;
            } else {
                this._velocity.x += this._cache[11] * this._cache_left_right.x;
                this._velocity.z += this._cache[11] * this._cache_left_right.z;
            }
        } else if (this.engine.key_down_up ^ this.engine.key_down_down) {
            // Move along normal.
            if (this.engine.key_down_up) {
                this._velocity.addScaledVector(this._cache_normal, this._cache[10]);
            } else {
                this._velocity.addScaledVector(this._cache_normal, -this._cache[10]);
            }
        } else if (this.engine.key_down_left ^ this.engine.key_down_right) {
            // Move left-right.
            if (this.engine.key_down_left) {
                this._velocity.x += (-this._cache[10]) * this._cache_left_right.x;
                this._velocity.z += (-this._cache[10]) * this._cache_left_right.z;
            } else {
                this._velocity.x += this._cache[10] * this._cache_left_right.x;
                this._velocity.z += this._cache[10] * this._cache_left_right.z;
            }
        }
    },

    physics: function(delta) {
        // Directional view update.
        if (this._mouse_update_flag != _MOUSE_UPDATE_NONE) {
            this.update_mouse_view();
            this._update_player_matrix = true;
        }

        // Position value update.
        if (
            (this._velocity.x > .001 || this._velocity.x < -.001) ||
            (this._velocity.y > .001 || this._velocity.y < -.001) ||
            (this._velocity.z > .001 || this._velocity.z < -.001) ||
            (this._position_frame_target.x != this._position_frame_previous.x) ||
            (this._position_frame_target.y != this._position_frame_previous.y) ||
            (this._position_frame_target.z != this._position_frame_previous.z)
        ) {
            this._position_frame_target.add(this._velocity);
            this._position_frame_previous.lerp(this._position_frame_target, this._cache[13]);
            this.yaw.position.set(this._position_frame_previous.x, this._position_frame_previous.y, this._position_frame_previous.z);

            //this._cache[9] = Math.pow(this._cache[12], 1);
            this._velocity.multiplyScalar(Math.pow(this._cache[12], 1));

            this._update_player_matrix = true;
        }

        // Movement and look at direction can change but without updating matrix the changes won't be applied.
        if (this._update_player_matrix) {
            this.yaw.updateMatrix();
            this.pitch.updateMatrix();
            this._update_player_matrix = false;

            this._update_flashlight();
        }

        // 2 conditions (thus far) on when to not check input position updates.
        // 0x0: Player has no movement allowed.
        // 0x1: No movement input key is down.
        if (this.has_movement() && (this.engine.key_down_space || this.engine.key_down_shift || this.engine.key_down_up || this.engine.key_down_down || this.engine.key_down_left || this.engine.key_down_right)) {
            this._physics();
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
