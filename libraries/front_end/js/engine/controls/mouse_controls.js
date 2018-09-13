'use strict';

$_QE.prototype.MouseControls = function() {

    this.pitch = new THREE.Object3D();
    this.pitch.add(this.camera);
    this.yaw = new THREE.Object3D();
    this.yaw.add(this.pitch);

    //this._previous_yaw

    // For optimization purposes.
    this._cache_normal         = new THREE.Vector3();
    this._cache_left_right     = new THREE.Vector3();
    this._cache_walking_normal = new THREE.Vector3();
    this._cache_for_look_at    = new THREE.Vector3();
    this._cache_horizontal     = new THREE.Vector2();

    // More cache to organize.

    this._mouse_view_update_needed = false;

    this._mouse_angle_horizontal = 0;
    this._mouse_angle_vertical   = 0;

    this._MATH_PIE_TWO             = Math.PI * 2.0;
    this._MATH_PIE_HALVED          = Math.PI * 0.5;
    this._MATH_PIE_HALVED_NEGATIVE = Math.PI * -0.5;

    this._MATH_FUNCTION_COS        = Math.cos;
    this._MATH_FUNCTION_SIN        = Math.sin;

    this.look_at_xyz = function(x, y, z) {
        this._cache_for_look_at.set(x, y, z);
        this._cache_for_look_at.sub(this.yaw.position);
        this._cache_for_look_at.normalize();

        this._cache_horizontal.set(this._cache_normal.x, this._cache_normal.z);
        this._cache_horizontal.normalize();

        this._mouse_angle_horizontal += Math.atan2(this._cache_horizontal.y, this._cache_horizontal.x) - Math.atan2(this._cache_for_look_at.z, this._cache_for_look_at.x);
        this._mouse_angle_vertical   = Math.asin(this._cache_for_look_at.y);

        this._mouse_view_update_needed = true;
    };

    this.set_normal_xyz = function(x, y, z) {
        this._mouse_angle_horizontal += Math.atan2(y, x) - Math.atan2(z, x);
        this._mouse_angle_vertical   = Math.asin(y);

        this._mouse_view_update_needed = true;
    };

    this.look_at = function(position_vector) {
        this.look_at_xyz(position_vector.x, position_vector.y, position_vector.z);
    };

    this.update_mouse_view = function() {
        if (this._mouse_view_update_needed) {
            this._mouse_view_update_needed = false;
        } else {
            return;
        }

        // TODO: lerp the rotation value! (This will need '_mouse_view_update_needed' logic updated.)

        // Notes in math.txt.
        let c1 = this._MATH_FUNCTION_COS(this._mouse_angle_vertical   / 2);
        let c2 = this._MATH_FUNCTION_COS(this._mouse_angle_horizontal / 2);
        let s1 = this._MATH_FUNCTION_SIN(this._mouse_angle_vertical   / 2);
        let s2 = this._MATH_FUNCTION_SIN(this._mouse_angle_horizontal / 2);

        let a_2 = c1 * c1;
        let b_2 = c2 * c2;
        let c_2 = s1 * s1;
        let d_2 = s2 * s2;

        this._cache_normal.set(
            2.0 * (s2 * c2) * (c_2 - a_2),
            2.0 * (c1 * s1) * (b_2 + d_2),
            b_2 * (c_2 - a_2) + d_2 * (a_2 - c_2)
        );

        let normalizer = 1.0 / Math.sqrt(this._cache_normal.x * this._cache_normal.x + this._cache_normal.z * this._cache_normal.z);
        this._cache_walking_normal.set(this._cache_normal.x * normalizer, 0, this._cache_normal.z * normalizer);
        this._cache_left_right.set(-this._cache_walking_normal.z, 0, this._cache_walking_normal.x);

        this.yaw.rotation.y = this._mouse_angle_horizontal;
        this.pitch.rotation.x = this._mouse_angle_vertical;
        this.yaw.updateMatrix();
        this.pitch.updateMatrix();
    };

    this.on_mouse_move = function(delta_x, delta_y) {
        // Pitch.
        if (delta_x !== 0) {


            this._mouse_angle_horizontal -= delta_x * 0.002;
            if (this._mouse_angle_horizontal < 0) {
                this._mouse_angle_horizontal += Math.floor(-this._mouse_angle_horizontal / this._MATH_PIE_TWO) * this._MATH_PIE_TWO;
            } else if (this._mouse_angle_horizontal >= this._MATH_PIE_TWO) {
                this._mouse_angle_horizontal -= Math.floor(this._mouse_angle_horizontal / this._MATH_PIE_TWO) * this._MATH_PIE_TWO;
            }
            //this._mouse_view_update_needed = true;
            this._mouse_view_update_needed = true;
        }
        // Yaw.
        if (delta_y !== 0) {
            this._mouse_angle_vertical -= delta_y * 0.002;
            if (this._mouse_angle_vertical < this._MATH_PIE_HALVED_NEGATIVE) {
                this._mouse_angle_vertical = this._MATH_PIE_HALVED_NEGATIVE;
            } else if (this._mouse_angle_vertical > this._MATH_PIE_HALVED) {
                this._mouse_angle_vertical = this._MATH_PIE_HALVED;
            }
            //this._mouse_view_update_needed = true;
            this._mouse_view_update_needed = true;
        }
    };

    this.get_normal = function() {
        return this._cache_normal;
    };
};