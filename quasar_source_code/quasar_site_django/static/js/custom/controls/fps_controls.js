'use strict';

function FPSControls(camera) {
    this.__init__(camera);
}

FPSControls.prototype = {
    camera            : null,
    pitch             : null,
    yaw               : null,
    enabled           : null,

    // Movement.
    up                : null,
    down              : null,
    left              : null,
    right             : null,

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

    // Constants.
    half_pie          : null,
    max_view_angle    : null,
    diagonal_penalty  : null,
    ground_normal     : null,

    __init__: function(camera) {
        // Constants.
        this.diagonal_penalty = Math.sqrt(.5);
        this.ground_normal    = new THREE.Vector3(0, 1, 0);

        this.camera = camera;
        //this.camera.rotation.set(0, 0, 0)
        //this.camera.eulerOrder = 'ZYX'
        //this.camera.up = new THREE.Vector3(0, 1, 0)

        this.pitch = new THREE.Object3D();

        this.pitch.add(camera);

        this.yaw = new THREE.Object3D();
        this.yaw.add(this.pitch);

        this.enabled = false;
        this.flying_on = true;

        this.velocity = new THREE.Vector3();

        //this.pitch.rotation.x = Math.max(-1.0 * HALF_PIE, Math.min(HALF_PIE, this.pitch.rotation.x))
        this.mouse_movement_x_buffer = new CustomSmoothStep(this.yaw.rotation.y, 0.025, null, null);
        this.mouse_movement_y_buffer = new CustomSmoothStep(this.pitch.rotation.x, 0.025, -1.0 * HALF_PIE, HALF_PIE);

        // TODO : Add smooth step to the movement buffers!!!

        document.addEventListener('mousemove', this.on_mouse_move.bind(this), false);
        document.addEventListener('keydown', this.on_key_down.bind(this), false);
        document.addEventListener('keyup', this.on_key_up.bind(this), false);
    },

    toggle_flying: function() {
        this.flying_on = !this.flying_on;
        if (this.flying_on) {
            this.velocity.y = 0;
        }
    },

    fly_left: function(delta) {
        this.velocity.x += 200 * delta * this.left_right.x;
        this.velocity.y += 200 * delta * this.left_right.y;
        this.velocity.z += 200 * delta * this.left_right.z;
    },

    fly_right: function(delta) {
        this.velocity.x -= 200 * delta * this.left_right.x;
        this.velocity.y -= 200 * delta * this.left_right.y;
        this.velocity.z -= 200 * delta * this.left_right.z;
    },

    fly_forward: function(delta) {
        this.velocity.x += 200 * delta * this.direction_vector.x;
        this.velocity.y += 200 * delta * this.direction_vector.y;
        this.velocity.z += 200 * delta * this.direction_vector.z;
    },

    fly_backward: function(delta) {
        this.velocity.x -= 200 * delta * this.direction_vector.x;
        this.velocity.y -= 200 * delta * this.direction_vector.y;
        this.velocity.z -= 200 * delta * this.direction_vector.z;
    },

    move_forward: function(delta) {
        this.velocity.x += 200 * delta * this.direction_vector.x;
        this.velocity.z += 200 * delta * this.direction_vector.z;
    },

    move_backward: function(delta) {
        this.velocity.x -= 200 * delta * this.direction_vector.x;
        this.velocity.z -= 200 * delta * this.direction_vector.z;
    },

    move_left: function(delta) {
        this.velocity.x += 200 * delta * this.left_right.x;
        this.velocity.z += 200 * delta * this.left_right.z;
    },

    move_right: function(delta) {
        this.velocity.x -= 200 * delta * this.left_right.x;
        this.velocity.z -= 200 * delta * this.left_right.z;
    },

    physics: function(delta) {
        this.mouse_movement_x_buffer.update(delta);
        this.mouse_movement_y_buffer.update(delta);
        this.update_mouse_view_position();

        if (this.enabled) {
            if (this.flying_on) {
                // Flying code.
                if (this.space) {
                    this.velocity.y += 200.0 * delta;
                }
                if (this.shift) {
                    this.velocity.y -= 200.0 * delta;
                }

                if ((this.up ^ this.down) & (this.left ^ this.right)) {
                    if (this.up) {
                        this.fly_forward(delta * this.diagonal_penalty);
                    } else {
                        this.fly_backward(delta * this.diagonal_penalty);
                    }
                    if (this.left) {
                        this.fly_left(delta * this.diagonal_penalty);
                    } else {
                        this.fly_right(delta * this.diagonal_penalty);
                    }
                } else if (this.up ^ this.down) {
                    if (this.up) {
                        this.fly_forward(delta);
                    } else {
                        this.fly_backward(delta);
                    }
                } else if (this.left ^ this.right) {
                    if (this.left) {
                        this.fly_left(delta);
                    } else {
                        this.fly_right(delta);
                    }
                }
                this.velocity.y *= (1 - delta * 15);
                this.yaw.position.y += this.velocity.y;
            } else {
                // Walking code.
                if ((this.up ^ this.down) & (this.left ^ this.right)) {
                    if (this.up) {
                        this.move_forward(delta * this.diagonal_penalty);
                    } else {
                        this.move_backward(delta * this.diagonal_penalty);
                    }
                    if (this.left) {
                        this.move_left(delta * this.diagonal_penalty);
                    } else {
                        this.move_right(delta * this.diagonal_penalty);
                    }
                } else if (this.up ^ this.down) {
                    if (this.up) {
                        this.fly_forward(delta);
                    } else {
                        this.fly_backward(delta);
                    }
                } else if (this.left ^ this.right) {
                    if (this.left) {
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

    enable: function() {
        this.enabled = true;
    },

    disable: function() {
        this.enabled = false;
        // In case pause was pressed as a movement key was held down.
        // Reset movement variables so resuming back in doesn't leave one down until re-clicked.
        this.up    = false;
        this.down  = false;
        this.left  = false;
        this.right = false;
        this.space = false;
        this.shift = false;
    },

    on_key_down: function(event) {
        switch(event.keyCode) {
        case KEY_CODE_UP:
        case KEY_CODE_W:
            this.up = true;
            break;
        case KEY_CODE_LEFT:
        case KEY_CODE_A:
            this.left = true;
            break;
        case KEY_CODE_DOWN:
        case KEY_CODE_S:
            this.down = true;
            break;
        case KEY_CODE_RIGHT:
        case KEY_CODE_D:
            this.right = true;
            break;
        case KEY_CODE_SPACE:
            this.space = true;
            break;
        case KEY_CODE_SHIFT:
            this.shift = true;
            break;
        }
    },

    on_key_up: function(event) {
        switch(event.keyCode) {
        case KEY_CODE_UP:
        case KEY_CODE_W:
            this.up = false;
            break;
        case KEY_CODE_LEFT:
        case KEY_CODE_A:
            this.left = false;
            break;
        case KEY_CODE_DOWN:
        case KEY_CODE_S:
            this.down = false;
            break;
        case KEY_CODE_RIGHT:
        case KEY_CODE_D:
            this.right = false;
            break;
        case KEY_CODE_SPACE:
            this.space = false;
            break;
        case KEY_CODE_SHIFT:
            this.shift = false;
            break;
        }
    },

    look_at: function(position_vector_to_look_at) {
        var look_at_normal = new THREE.Vector3(position_vector_to_look_at.x, position_vector_to_look_at.y, position_vector_to_look_at.z);
        look_at_normal.sub(this.yaw.position);
        look_at_normal.normalize();

        var look_at_angle = Math.atan2(look_at_normal.z, look_at_normal.x);

        var d = this.get_direction();
        var x_rotation = new THREE.Vector2(d.x, d.z);
        x_rotation.normalize();

        var angle = Math.atan2(x_rotation.y, x_rotation.x);

        var current_x_value = this.mouse_movement_x_buffer.get_current_value();
        this.mouse_movement_x_buffer.clear_buffer();
        this.mouse_movement_x_buffer.set_value(current_x_value + (-1.0 * (look_at_angle - angle)));

        this.mouse_movement_y_buffer.clear_buffer();
        this.mouse_movement_y_buffer.set_value(Math.asin(look_at_normal.y));

        //this.mouse_movement_x_buffer.add_force(-1.0 * (look_at_angle - angle))
    },

    update_mouse_view_position: function() {
        //l('Current x value : ' + this.mouse_movement_x_buffer.get_current_value());
        //l('Current y value : ' + this.mouse_movement_y_buffer.get_current_value());

        this.yaw.rotation.y = this.mouse_movement_x_buffer.get_current_value();
        this.pitch.rotation.x = this.mouse_movement_y_buffer.get_current_value();

        //this.pitch.rotation.x = Math.max(-1.0 * HALF_PIE, Math.min(HALF_PIE, this.pitch.rotation.x))
        // TODO : Remove/change this line, the buffer will handle the min and max values
        this.pitch.rotation.x = Math.max(-0.999 * HALF_PIE, Math.min(HALF_PIE - 0.001, this.mouse_movement_y_buffer.get_current_value()));

        this.direction_vector = this.get_direction();
        this.direction_vector.normalize();

        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.direction_vector);
        this.left_right.normalize();

        if (!this.flying_on) {
            this.walking_direction = new THREE.Vector3(this.direction_vector.x, this.direction_vector.y, this.direction_vector.z);
            this.walking_direction = this.walking_direction.projectOnPlane(this.ground_normal);
            this.walking_direction.normalize();
        }
    },

    on_mouse_move: function(event) {
        var movement_x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;

        if (this.enabled) {
            var movement_y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            this.mouse_movement_x_buffer.add_force(movement_x * -0.002);
            this.mouse_movement_y_buffer.add_force(movement_y * -0.002);
        }

        if (CURRENT_PLAYER.is_engaged()) {
            var c = MANAGER_WORLD.current_world.currently_looked_at_object;
            if (is_defined(c)) {
                if (c.requires_mouse_x_movement) {
                    c.provide_mouse_x_movement(movement_x);
                }
                if (c.requires_mouse_y_movement) {
                    c.provide_mouse_y_movement(movement_y);
                }
            }
        }
    },

    get_direction: function() {
        var direction = new THREE.Vector3(0, 0, -1);
        var rotation  = new THREE.Euler(this.mouse_movement_y_buffer.get_current_value(), this.mouse_movement_x_buffer.get_current_value(), 0, 'YXZ');
        return direction.applyEuler(rotation);
    }

};