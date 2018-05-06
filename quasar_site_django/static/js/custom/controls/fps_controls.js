'use strict';

Player.prototype.load_fps_controls = function() {
    function FPSControls() {}
    FPSControls.prototype = {
        camera            : null,
        pitch             : null,
        yaw               : null,

        // Movement.
        velocity          : null,
        acceleration      : null,

        flying_on         : null,
        left_right        : null,

        walking_direction : null,

        direction_object3D : null,

        camera_object3D    : null,

        // Camera view.
        max_upward_view   : null,
        max_downward_view : null,
        direction_vector  : null,

        // Used to make mouse movement feel smoother.
        mouse_movement_x_buffer: null,
        mouse_movement_y_buffer: null,

        initialize: function(current_player) {

            this.current_player = current_player;

            this.movement_speed = 300;

            this.camera = MANAGER_RENDERER.camera;
            //this.camera.rotation.set(0, 0, 0)
            //this.camera.eulerOrder = 'ZYX'
            //this.camera.up = new THREE.Vector3(0, 1, 0)

            this.pitch = new THREE.Object3D();

            this.pitch.add(this.camera);

            this.yaw = new THREE.Object3D();
            this.yaw.add(this.pitch);

            this.flying_on = true;

            this.velocity = new THREE.Vector3();

            this.half_pie = Math.PI / 2.0;
            this.negative_half_pie = -1.0 * this.half_pie;

            this.mouse_movement_x_buffer = new CustomSmoothStep(this.yaw.rotation.y, 0.025, null, null);
            this.mouse_movement_y_buffer = new CustomSmoothStep(this.pitch.rotation.x, 0.025, this.negative_half_pie + .001, this.half_pie - .001);

            // TODO : Add smooth step to the movement buffers!!!

            // For optimization purposes.
            this._previous_direction  = null;
            this._direction           = new THREE.Vector3(0, 0, -1);
            this._rotation            = new THREE.Euler(0, 0, 0, 'YXZ');
            this._look_at_normal      = new THREE.Vector3(0, 0, 0);
            this._horizontal_rotation = new THREE.Vector2(0, 0);
            this._walking_direction   = new THREE.Vector3(0, 0, 0);
            this._left_right          = new THREE.Vector3(0, 0, 0);
        },

        set_input_manager_reference: function(input_manager) {
            this.input_manager = input_manager;
        },

        toggle_flying: function() {
            this.flying_on = !this.flying_on;
            if (this.flying_on) {
                this.velocity.y = 0;
            }
        },

        fly_left: function(delta) {
            this.velocity.x -= this.movement_speed * delta * this._left_right.x;
            this.velocity.y -= this.movement_speed * delta * this._left_right.y;
            this.velocity.z -= this.movement_speed * delta * this._left_right.z;
        },

        fly_right: function(delta) {
            this.velocity.x += this.movement_speed * delta * this._left_right.x;
            this.velocity.y += this.movement_speed * delta * this._left_right.y;
            this.velocity.z += this.movement_speed * delta * this._left_right.z;
        },

        fly_forward: function(delta) {
            this.velocity.x += this.movement_speed * delta * this._walking_direction.x;
            this.velocity.z += this.movement_speed * delta * this._walking_direction.z;

            //this.velocity.x += 200 * delta * this.direction_vector.x;
            this.velocity.y += this.movement_speed * delta * this.direction_vector.y;
            //this.velocity.z += 200 * delta * this.direction_vector.z;
        },

        fly_backward: function(delta) {
            this.velocity.x -= this.movement_speed * delta * this._walking_direction.x;
            this.velocity.z -= this.movement_speed * delta * this._walking_direction.z;

            //this.velocity.x -= 200 * delta * this.direction_vector.x;
            this.velocity.y -= this.movement_speed * delta * this.direction_vector.y;
            //this.velocity.z -= 200 * delta * this.direction_vector.z;
        },

        move_forward: function(delta) {
            this.velocity.x += this.movement_speed * delta * this.direction_vector.x;
            this.velocity.z += this.movement_speed * delta * this.direction_vector.z;
        },

        move_backward: function(delta) {
            this.velocity.x -= this.movement_speed * delta * this.direction_vector.x;
            this.velocity.z -= this.movement_speed * delta * this.direction_vector.z;
        },

        move_left: function(delta) {
            this.velocity.x += this.movement_speed * delta * this._left_right.x;
            this.velocity.z += this.movement_speed * delta * this._left_right.z;
        },

        move_right: function(delta) {
            this.velocity.x -= this.movement_speed * delta * this._left_right.x;
            this.velocity.z -= this.movement_speed * delta * this._left_right.z;
        },

        set_mobile_movement: function(direction_vector) {
            this.has_mobile_movement = true;
            this.mobile_forward    = direction_vector.y;
            this.mobile_horizontal = direction_vector.x;
        },

        stop_mobile_movement: function() {
            this.has_mobile_movement = false;
        },

        reset_velocity: function() {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;
        },

        physics: function(delta) {
            this.mouse_movement_x_buffer.update(delta);
            this.mouse_movement_y_buffer.update(delta);
            this.update_mouse_view_position();

            if (!this.current_player.has_movement()) {
                return;
            }

            if (this.has_mobile_movement) {
                this.fly_forward(delta * this.mobile_forward);
                this.fly_left(delta * this.mobile_horizontal);
            }

            if (this.flying_on) {
            // Flying code.
                if (this.input_manager.space) {
                    this.velocity.y += this.movement_speed * delta;
                }
                if (this.input_manager.shift) {
                    this.velocity.y -= this.movement_speed * delta;
                }

                if ((this.input_manager.up ^ this.input_manager.down) & (this.input_manager.left ^ this.input_manager.right)) {
                    if (this.input_manager.up) {
                        this.fly_forward(delta * DIAGONAL_PENALTY);
                    } else {
                        this.fly_backward(delta * DIAGONAL_PENALTY);
                    }
                    if (this.input_manager.left) {
                        this.fly_left(delta * DIAGONAL_PENALTY);
                    } else {
                        this.fly_right(delta * DIAGONAL_PENALTY);
                    }
                } else if (this.input_manager.up ^ this.input_manager.down) {
                    if (this.input_manager.up) {
                        this.fly_forward(delta);
                    } else {
                        this.fly_backward(delta);
                    }
                } else if (this.input_manager.left ^ this.input_manager.right) {
                    if (this.input_manager.left) {
                        this.fly_left(delta);
                    } else {
                        this.fly_right(delta);
                    }
                }
                this.velocity.y *= (1 - delta * 15);
                this.yaw.position.y += this.velocity.y;
            } else {
            // Walking code.
                if ((this.input_manager.up ^ this.input_manager.down) & (this.input_manager.left ^ this.input_manager.right)) {
                    if (this.input_manager.up) {
                        this.move_forward(delta * DIAGONAL_PENALTY);
                    } else {
                        this.move_backward(delta * DIAGONAL_PENALTY);
                    }
                    if (this.input_manager.left) {
                        this.move_left(delta * DIAGONAL_PENALTY);
                    } else {
                        this.move_right(delta * DIAGONAL_PENALTY);
                    }
                } else if (this.input_manager.up ^ this.input_manager.down) {
                    if (this.input_manager.up) {
                        this.fly_forward(delta);
                    } else {
                        this.fly_backward(delta);
                    }
                } else if (this.input_manager.left ^ this.input_manager.right) {
                    if (this.input_manager.left) {
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
        },

        get_position: function() {
            return this.yaw.position;
        },

        get_velocity: function() {
            return this.velocity;
        },

        look_at: function(position_vector_to_look_at) {
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
        },

        update_mouse_view_position: function() {
            this.yaw.rotation.y = this.mouse_movement_x_buffer.get_current_value();
            this.pitch.rotation.x = this.mouse_movement_y_buffer.get_current_value();

            this.direction_vector = this.get_direction();

            this._walking_direction.set(this.direction_vector.x, 0, this.direction_vector.z);
            this._walking_direction.normalize();

            this.direction_vector.normalize();

            this._left_right.set(this._walking_direction.x, 0, this._walking_direction.z);
            this._left_right.cross(UP_VECTOR);
            this._left_right.normalize();

            this._previous_direction = null;
        },

        on_mouse_move: function(movement_x, movement_y) {
            this.mouse_movement_x_buffer.add_force(movement_x * -0.002);
            this.mouse_movement_y_buffer.add_force(movement_y * -0.002);
        },

        get_direction: function() {
            if (this._previous_direction === null) {
                return this._get_direction();
            }
            return this._previous_direction;
        },

        _get_direction: function() {
            this._direction.set(0, 0, -1);
            this._rotation.set(this.mouse_movement_y_buffer.get_current_value(), this.mouse_movement_x_buffer.get_current_value(), 0);

            this._previous_direction = this._direction.applyEuler(this._rotation);
            return this._previous_direction;
        }
    };

    this.fps_controls = new FPSControls();
    this.fps_controls.initialize(this);
};