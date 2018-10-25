'use strict';

// PIE * 2  == 6.283185307179586
// PIE / 2  == 1.5707963267948966
// -PIE / 2 == -1.5707963267948966

const _MOUSE_UPDATE_NONE     = 0; // #pre-process_global_constant
const _MOUSE_UPDATE_FOR_X    = 1; // #pre-process_global_constant
const _MOUSE_UPDATE_FOR_Y    = 2; // #pre-process_global_constant
const _MOUSE_UPDATE_FOR_BOTH = 3; // #pre-process_global_constant


Object.assign($_QE.prototype.Player.prototype, {
    pitch                     : new THREE.Object3D(),
    yaw                       : new THREE.Object3D(),

    // For optimization purposes.
    _cache_normal             : new THREE.Vector3(),
    _cache_left_right         : new THREE.Vector3(),
    _cache_walking_normal     : new THREE.Vector3(),
    _cache_for_look_at        : new THREE.Vector3(),
    _cache_horizontal         : new THREE.Vector2(),
    //_cache_mouse              : new Float64Array(9),

    _mouse_update_flag        : _MOUSE_UPDATE_NONE,

    _mouse_angle_horizontal   : 0,
    _mouse_angle_vertical     : 0,

    look_at_xyz: function(x, y, z) {
        this._cache_for_look_at.set(x, y, z);
        this._cache_for_look_at.sub(this.yaw.position);
        this._cache_for_look_at.normalize();

        this._cache_horizontal.set(this._cache_normal.x, this._cache_normal.z);
        this._cache_horizontal.normalize();

        this._mouse_angle_horizontal += Math.atan2(this._cache_horizontal.y, this._cache_horizontal.x) - Math.atan2(this._cache_for_look_at.z, this._cache_for_look_at.x);
        this._mouse_angle_vertical   = Math.asin(this._cache_for_look_at.y);

        this._mouse_update_flag      = _MOUSE_UPDATE_FOR_BOTH;
    },

    set_normal_xyz: function(x, y, z) {
        this._mouse_angle_horizontal += Math.atan2(y, x) - Math.atan2(z, x);
        this._mouse_angle_vertical   = Math.asin(y);

        this._mouse_update_flag      = _MOUSE_UPDATE_FOR_BOTH;
    },

    look_at: function(position_vector) {
        this.look_at_xyz(position_vector.x, position_vector.y, position_vector.z);
    },

    update_mouse_view: function() {
        if (this._mouse_update_flag == _MOUSE_UPDATE_FOR_X || this._mouse_update_flag == _MOUSE_UPDATE_FOR_BOTH) {
            this.yaw.rotation.y   = this._mouse_angle_horizontal;
            this._cache[1]  = Math.cos(this._mouse_angle_horizontal / 2);
            this._cache[3]  = Math.sin(this._mouse_angle_horizontal / 2);
            this._cache[7]  = this._cache[1] * this._cache[1];
            this._cache[8]  = this._cache[3] * this._cache[3];
        }
        if (this._mouse_update_flag == _MOUSE_UPDATE_FOR_Y || this._mouse_update_flag == _MOUSE_UPDATE_FOR_BOTH) {
            this.pitch.rotation.x = this._mouse_angle_vertical;
            this._cache[0]  = Math.cos(this._mouse_angle_vertical / 2);
            this._cache[2]  = Math.sin(this._mouse_angle_vertical / 2);
            this._cache[5]  = this._cache[0] * this._cache[0];
            this._cache[6]  = this._cache[2] * this._cache[2];
        }

        this._cache_normal.set(
            (2.0 * this._cache[3] * this._cache[1]) * (this._cache[6] - this._cache[5]),
            (2.0 * this._cache[0] * this._cache[2]) * (this._cache[7] + this._cache[8]),
            this._cache[7] * (this._cache[6] - this._cache[5]) + this._cache[8] * (this._cache[5] - this._cache[6])
        );

        // Normalizer.
        this._cache[4] = 1.0 / Math.sqrt(this._cache_normal.x * this._cache_normal.x + this._cache_normal.z * this._cache_normal.z);
        this._cache_walking_normal.set(this._cache_normal.x * this._cache[4], 0, this._cache_normal.z * this._cache[4]);
        this._cache_left_right.set(-this._cache_walking_normal.z, 0, this._cache_walking_normal.x);

        //this.yaw.updateMatrix();
        //this.pitch.updateMatrix();

        this._mouse_update_flag = _MOUSE_UPDATE_NONE;
    },

    // Pitch.
    on_mouse_move_x: function(delta_x) {
        this._mouse_angle_horizontal -= delta_x * 0.002;
        if (this._mouse_angle_horizontal < 0) {
            this._mouse_angle_horizontal += Math.floor(-this._mouse_angle_horizontal / 6.283185307179586) * 6.283185307179586;
        } else if (this._mouse_angle_horizontal >= 6.283185307179586) {
            this._mouse_angle_horizontal -= Math.floor(this._mouse_angle_horizontal / 6.283185307179586) * 6.283185307179586;
        }

        switch(this._mouse_update_flag) {
        case _MOUSE_UPDATE_FOR_Y:
            this._mouse_update_flag = _MOUSE_UPDATE_FOR_BOTH;
            break;
        case _MOUSE_UPDATE_NONE:
            this._mouse_update_flag = _MOUSE_UPDATE_FOR_X;
            break;
        }
    },

    // Yaw.
    on_mouse_move_y: function(delta_y) {
        this._mouse_angle_vertical -= delta_y * 0.002;
        if (this._mouse_angle_vertical < -1.5707963267948966) {
            this._mouse_angle_vertical = -1.5707963267948966;
        } else if (this._mouse_angle_vertical > 1.5707963267948966) {
            this._mouse_angle_vertical = 1.5707963267948966;
        }

        switch(this._mouse_update_flag) {
        case _MOUSE_UPDATE_FOR_X:
            this._mouse_update_flag = _MOUSE_UPDATE_FOR_BOTH;
            break;
        case _MOUSE_UPDATE_NONE:
            this._mouse_update_flag = _MOUSE_UPDATE_FOR_Y;
            break;
        }
    },

    get_normal: function(vector=null) {
        if (vector != null) {
            vector.set(
                this._cache_normal.x,
                this._cache_normal.y,
                this._cache_normal.z
            );
        } else {
            return this._cache_normal;
        }
    },
});


// From update_mouse_view
// TODO: lerp the rotation value! (This will need '_mouse_view_update_needed' logic updated.)

// Notes in math.txt.
/*
        let a_2 = c1 * c1;    (c1 is this._cache_mouse_view[0])
        let b_2 = c2 * c2;    (c2 is this._cache_mouse_view[1])
        let c_2 = s1 * s1;    (s1 is this._cache_mouse_view[2])
        let d_2 = s2 * s2;    (s2 is this._cache_mouse_view[3])
        this._cache_normal.set(
            2.0 * (s2 * c2) * (c_2 - a_2),
            2.0 * (c1 * s1) * (b_2 + d_2),
            b_2 * (c_2 - a_2) + d_2 * (a_2 - c_2)
        );
*/
