'use strict';

$_QE.prototype.FPSControls = function(camera) {

    this.movement_speed = 300;
    this.camera = camera;

    this.pitch = new THREE.Object3D();

    this.pitch.add(this.camera);

    this.yaw = new THREE.Object3D();
    this.yaw.add(this.pitch);

    this.flying_on = true;

    this.velocity = new THREE.Vector3();

    this.half_pie = Math.PI / 2.0;
    this.negative_half_pie = -1.0 * this.half_pie;

    this.mouse_movement_x_buffer = new $_QE.prototype.TimeValueBuffer(this.yaw.rotation.y, 0.025, null, null);
    this.mouse_movement_y_buffer = new $_QE.prototype.TimeValueBuffer(this.pitch.rotation.x, 0.025, this.negative_half_pie + .001, this.half_pie - .001);

    // For optimization purposes.
    this._current_yaw         = 0.0;
    this._current_pitch       = 0.0;
    this._previous_yaw        = -1.0;
    this._previous_pitch      = -1.0;
    this._previous_direction  = null;
    this._direction           = new THREE.Vector3(0, 0, -1);
    this._rotation            = new THREE.Euler(0, 0, 0, 'YXZ');
    this._look_at_normal      = new THREE.Vector3(0, 0, 0);
    this._horizontal_rotation = new THREE.Vector2(0, 0);
    this._walking_direction   = new THREE.Vector3(0, 0, 0);
    this._left_right          = new THREE.Vector3(0, 0, 0);

    this.set_position_xyz = function(x, y, z) {
        this.yaw.position.set(x, y, z);
    };

    this.set_position = function(vector) {
        this.yaw.position.x = vector.x;
        this.yaw.position.y = vector.y;
        this.yaw.position.z = vector.z;
    };

    this.toggle_flying = function() {
        this.flying_on = !this.flying_on;
        if (this.flying_on) {
            this.velocity.y = 0;
        }
    };

    this.fly_left = function(delta) {
        this.velocity.x -= this.movement_speed * delta * this._left_right.x;
        this.velocity.y -= this.movement_speed * delta * this._left_right.y;
        this.velocity.z -= this.movement_speed * delta * this._left_right.z;
    };

    this.fly_right = function(delta) {
        this.velocity.x += this.movement_speed * delta * this._left_right.x;
        this.velocity.y += this.movement_speed * delta * this._left_right.y;
        this.velocity.z += this.movement_speed * delta * this._left_right.z;
    };

    this.fly_forward = function(delta) {
        this.velocity.x += this.movement_speed * delta * this._walking_direction.x;
        this.velocity.z += this.movement_speed * delta * this._walking_direction.z;

        //this.velocity.x += 200 * delta * this.direction_vector.x;
        this.velocity.y += this.movement_speed * delta * this.direction_vector.y;
        //this.velocity.z += 200 * delta * this.direction_vector.z;
    };

    this.fly_backward = function(delta) {
        this.velocity.x -= this.movement_speed * delta * this._walking_direction.x;
        this.velocity.z -= this.movement_speed * delta * this._walking_direction.z;

        //this.velocity.x -= 200 * delta * this.direction_vector.x;
        this.velocity.y -= this.movement_speed * delta * this.direction_vector.y;
        //this.velocity.z -= 200 * delta * this.direction_vector.z;
    };

    this.move_forward = function(delta) {
        this.velocity.x += this.movement_speed * delta * this.direction_vector.x;
        this.velocity.z += this.movement_speed * delta * this.direction_vector.z;
    };

    this.move_backward = function(delta) {
        this.velocity.x -= this.movement_speed * delta * this.direction_vector.x;
        this.velocity.z -= this.movement_speed * delta * this.direction_vector.z;
    };

    this.move_left = function(delta) {
        this.velocity.x += this.movement_speed * delta * this._left_right.x;
        this.velocity.z += this.movement_speed * delta * this._left_right.z;
    };

    this.move_right = function(delta) {
        this.velocity.x -= this.movement_speed * delta * this._left_right.x;
        this.velocity.z -= this.movement_speed * delta * this._left_right.z;
    };

    this.set_mobile_movement = function(direction_vector) {
        this.has_mobile_movement = true;
        this.mobile_forward    = direction_vector.y;
        this.mobile_horizontal = direction_vector.x;
    };

    this.stop_mobile_movement = function() {
        this.has_mobile_movement = false;
    };

    this.reset_velocity = function() {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.velocity.z = 0;
    };

    this.physics = function(delta) {
        this.mouse_movement_x_buffer.update(delta);
        this.mouse_movement_y_buffer.update(delta);
        this.update_mouse_view_position();

        if (!this.has_movement()) {
            return;
        }

        //l('performing physics');

        if (this.has_mobile_movement) {
            this.fly_forward(delta * this.mobile_forward);
            this.fly_left(delta * this.mobile_horizontal);
        }

        if (this.flying_on) {
            // Flying code.
            if (this.input_manager.key_down_space) {
                this.velocity.y += this.movement_speed * delta;
            }
            if (this.input_manager.key_down_shift) {
                this.velocity.y -= this.movement_speed * delta;
            }

            if ((this.input_manager.key_down_up ^ this.input_manager.key_down_down) & (this.input_manager.key_down_left ^ this.input_manager.key_down_right)) {
                if (this.input_manager.key_down_up) {
                    this.fly_forward(delta * DIAGONAL_PENALTY);
                } else {
                    this.fly_backward(delta * DIAGONAL_PENALTY);
                }
                if (this.input_manager.key_down_left) {
                    this.fly_left(delta * DIAGONAL_PENALTY);
                } else {
                    this.fly_right(delta * DIAGONAL_PENALTY);
                }
            } else if (this.input_manager.key_down_up ^ this.input_manager.key_down_down) {
                if (this.input_manager.key_down_up) {
                    this.fly_forward(delta);
                } else {
                    this.fly_backward(delta);
                }
            } else if (this.input_manager.key_down_left ^ this.input_manager.key_down_right) {
                if (this.input_manager.key_down_left) {
                    this.fly_left(delta);
                } else {
                    this.fly_right(delta);
                }
            }
            this.velocity.y *= (1 - delta * 15);
            this.yaw.position.y += this.velocity.y;
        } else {
            // Walking code.
            if ((this.input_manager.key_down_up ^ this.input_manager.key_down_down) & (this.input_manager.key_down_left ^ this.input_manager.key_down_right)) {
                if (this.input_manager.key_down_up) {
                    this.move_forward(delta * DIAGONAL_PENALTY);
                } else {
                    this.move_backward(delta * DIAGONAL_PENALTY);
                }
                if (this.input_manager.key_down_left) {
                    this.move_left(delta * DIAGONAL_PENALTY);
                } else {
                    this.move_right(delta * DIAGONAL_PENALTY);
                }
            } else if (this.input_manager.key_down_up ^ this.input_manager.key_down_down) {
                if (this.input_manager.key_down_up) {
                    this.fly_forward(delta);
                } else {
                    this.fly_backward(delta);
                }
            } else if (this.input_manager.key_down_left ^ this.input_manager.key_down_right) {
                if (this.input_manager.key_down_left) {
                    this.move_left(delta);
                } else {
                    this.move_right(delta);
                }
            }

            if (this.velocity.y != 0) {
                this.velocity.y -= 9.8 * delta * 10;
                this.velocity.y *= (1 - delta * 15);
                this.yaw.position.y += this.velocity.y;
                if (this.yaw.position.y <= 10) {
                    this.yaw.position.y = 10;
                    this.velocity.y = 0;
                }
            }
        }

        // Both flying and walking treat the following lines the same.
        this.velocity.x *= (1 - delta * 15);
        this.velocity.z *= (1 - delta * 15);
        this.yaw.position.x += this.velocity.x;
        this.yaw.position.z += this.velocity.z;
    };

    this.get_position = function() {
        return this.yaw.position;
    };

    this.get_velocity = function() {
        return this.velocity;
    };

    this.look_at = function(position_vector_to_look_at) {
        //let look_at_normal = new THREE.Vector3(position_vector_to_look_at.x, position_vector_to_look_at.y, position_vector_to_look_at.z);
        this._look_at_normal.set(position_vector_to_look_at.x, position_vector_to_look_at.y, position_vector_to_look_at.z);
        this._look_at_normal.sub(this.yaw.position);
        this._look_at_normal.normalize();

        let look_at_angle = Math.atan2(this._look_at_normal.z, this._look_at_normal.x);

        let d = this.get_direction();
        //let horizontal_rotation = new THREE.Vector2(d.x, d.z);
        this._horizontal_rotation.set(d.x, d.z);
        this._horizontal_rotation.normalize();

        let angle = Math.atan2(this._horizontal_rotation.y, this._horizontal_rotation.x);

        let current_x_value = this.mouse_movement_x_buffer.get_current_value();
        this.mouse_movement_x_buffer.clear_buffer();
        this.mouse_movement_x_buffer.set_value(current_x_value + (-1.0 * (look_at_angle - angle)));

        this.mouse_movement_y_buffer.clear_buffer();
        this.mouse_movement_y_buffer.set_value(Math.asin(this._look_at_normal.y));

        //this.mouse_movement_x_buffer.add_force(-1.0 * (look_at_angle - angle))

        this._previous_direction = null;
    };

    this.update_mouse_view_position = function() {
        this._current_yaw = this.mouse_movement_x_buffer.get_current_value();
        this._current_pitch = this.mouse_movement_y_buffer.get_current_value();

        if (this._previous_yaw !== this._current_yaw || this._previous_pitch !== this._current_pitch) {
            this.yaw.rotation.y = this._current_yaw;
            this.pitch.rotation.x = this._current_pitch;

            this.direction_vector = this._get_direction_with_pitch_and_yaw();

            this._walking_direction.set(this.direction_vector.x, 0, this.direction_vector.z);
            this._walking_direction.normalize();

            this.direction_vector.normalize();

            this._left_right.set(this._walking_direction.x, 0, this._walking_direction.z);
            this._left_right.cross(QE.UP_VECTOR);
            this._left_right.normalize();

            this._previous_direction = null;

            this._previous_yaw = this._current_yaw;
            this._previous_pitch = this._current_pitch;
        }
    };

    this.on_mouse_move = function(movement_x, movement_y) {
        this.mouse_movement_x_buffer.add_force(movement_x * -0.002);
        this.mouse_movement_y_buffer.add_force(movement_y * -0.002);
    };

    this.get_direction = function() {
        if (this._previous_direction === null) {
            return this._get_direction();
        }
        return this._previous_direction;
    };

    this._get_direction_with_pitch_and_yaw = function() {
        if (this._previous_direction === null) {
            this._direction.set(0, 0, -1);
            this._rotation.set(this._current_pitch, this._current_yaw, 0);

            this._previous_direction = this._direction.applyEuler(this._rotation);
            return this._previous_direction;
        }
        return this._previous_direction;
    };

    this._get_direction = function() {
        this._direction.set(0, 0, -1);
        this._rotation.set(this.mouse_movement_y_buffer.get_current_value(), this.mouse_movement_x_buffer.get_current_value(), 0);

        this._previous_direction = this._direction.applyEuler(this._rotation);
        return this._previous_direction;
    };
};

