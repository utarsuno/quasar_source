'use strict'

function FPSControls(camera) {
    this.__init__(camera)
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

    // Camera view.
    max_upward_view   : null,
    max_downward_view : null,
    direction_vector  : null,

    // Mouse movement variables.
    buffer_mouse_movement: null,

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
        this.half_pie         = Math.PI / 2
        this.max_view_angle   = this.half_pie * 0.9
        this.diagonal_penalty = Math.sqrt(.5)
        this.ground_normal    = new THREE.Vector3(0, 1, 0)

        this.buffer_mouse_movement = true

        this.camera = camera
        this.camera.rotation.set(0, 0, 0)

        this.pitch = new THREE.Object3D()
        //this.pitch.add(camera)

        this.direction_object3D = new THREE.Object3D()
        this.direction_object3D.add(this.camera)

        this.yaw = new THREE.Object3D()
        //this.yaw.position.y = 10
        //
        //this.yaw.add(this.camera)
        //
        this.yaw.add(this.pitch)
        //

        this.enabled = false
        this.flying_on = true

        this.velocity = new THREE.Vector3()

        this.mouse_movement_x_buffer = new SmoothStepLowerLimitZero(this.yaw.rotation.y, 0.025)
        this.mouse_movement_y_buffer = new SmoothStepLowerLimitZero(this.yaw.rotation.x, 0.025)
        //this.mouse_movement_y_buffer = new SmoothStepLowerLimitZero(this.pitch.rotation.x, 0.025)

        // TODO : Add smooth step to the movement buffers!!!

        document.addEventListener('keypress', this.on_key_press.bind(this), false)
        document.addEventListener('mousemove', this.on_mouse_move.bind(this), false)
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        document.addEventListener('keyup', this.on_key_up.bind(this), false)
    },

    toggle_flying: function() {
        this.flying_on = !this.flying_on
        if (this.flying_on) {
            this.velocity.y = 0
        }
    },

    toggle_mouse_movement_system: function() {
        this.buffer_mouse_movement = !this.buffer_mouse_movement
    },

    fly_left: function(delta) {
        this.velocity.x += 200 * delta * this.left_right.x
        this.velocity.y += 200 * delta * this.left_right.y
        this.velocity.z += 200 * delta * this.left_right.z
    },

    fly_right: function(delta) {
        this.velocity.x -= 200 * delta * this.left_right.x
        this.velocity.y -= 200 * delta * this.left_right.y
        this.velocity.z -= 200 * delta * this.left_right.z
    },

    fly_forward: function(delta) {
        this.velocity.x += 200 * delta * this.direction_vector.x
        this.velocity.y += 200 * delta * this.direction_vector.y
        this.velocity.z += 200 * delta * this.direction_vector.z
    },

    fly_backward: function(delta) {
        this.velocity.x -= 200 * delta * this.direction_vector.x
        this.velocity.y -= 200 * delta * this.direction_vector.y
        this.velocity.z -= 200 * delta * this.direction_vector.z
    },

    move_forward: function(delta) {
        this.velocity.x += 200 * delta * this.direction_vector.x
        this.velocity.z += 200 * delta * this.direction_vector.z
    },

    move_backward: function(delta) {
        this.velocity.x -= 200 * delta * this.direction_vector.x
        this.velocity.z -= 200 * delta * this.direction_vector.z
    },

    move_left: function(delta) {
        this.velocity.x += 200 * delta * this.left_right.x
        this.velocity.z += 200 * delta * this.left_right.z
    },

    move_right: function(delta) {
        this.velocity.x -= 200 * delta * this.left_right.x
        this.velocity.z -= 200 * delta * this.left_right.z
    },

    physics: function(delta) {
        if (this.enabled) {

            if (this.buffer_mouse_movement) {
                this.mouse_movement_x_buffer.update(delta)
                this.mouse_movement_y_buffer.update(delta)
            }
            this.update_mouse_view_position()

            if (this.flying_on) {
                // Flying code.
                if (this.space) {
                    this.velocity.y += 200.0 * delta
                }
                if (this.shift) {
                    this.velocity.y -= 200.0 * delta
                }

                if ((this.up ^ this.down) & (this.left ^ this.right)) {
                    if (this.up) {
                        this.fly_forward(delta * this.diagonal_penalty)
                    } else {
                        this.fly_backward(delta * this.diagonal_penalty)
                    }
                    if (this.left) {
                        this.fly_left(delta * this.diagonal_penalty)
                    } else {
                        this.fly_right(delta * this.diagonal_penalty)
                    }
                } else if (this.up ^ this.down) {
                    if (this.up) {
                        this.fly_forward(delta)
                    } else {
                        this.fly_backward(delta)
                    }
                } else if (this.left ^ this.right) {
                    if (this.left) {
                        this.fly_left(delta)
                    } else {
                        this.fly_right(delta)
                    }
                }
                this.velocity.y *= (1 - delta * 15)
                this.yaw.position.y += this.velocity.y
            } else {
                // Walking code.
                if ((this.up ^ this.down) & (this.left ^ this.right)) {
                    if (this.up) {
                        this.move_forward(delta * this.diagonal_penalty)
                    } else {
                        this.move_backward(delta * this.diagonal_penalty)
                    }
                    if (this.left) {
                        this.move_left(delta * this.diagonal_penalty)
                    } else {
                        this.move_right(delta * this.diagonal_penalty)
                    }
                } else if (this.up ^ this.down) {
                    if (this.up) {
                        this.fly_forward(delta)
                    } else {
                        this.fly_backward(delta)
                    }
                } else if (this.left ^ this.right) {
                    if (this.left) {
                        this.move_left(delta)
                    } else {
                        this.move_right(delta)
                    }
                }
                if (this.velocity.y != 0) {
                    this.velocity.y -= 9.8 * delta * 10
                    this.velocity.y *= (1 - delta * 15)
                    this.yaw.position.y += this.velocity.y
                    if (this.yaw.position.y <= 10) {
                        this.yaw.position.y = 10
                        this.velocity.y = 0
                    }
                }
            }
            // Both flying and walking treat the following lines the same.
            this.velocity.x *= (1 - delta * 15)
            this.velocity.z *= (1 - delta * 15)
            this.yaw.position.x += this.velocity.x
            this.yaw.position.z += this.velocity.z
        }
    },

    get_position: function() {
        return this.yaw.position
    },

    get_velocity: function() {
        return this.velocity
    },

    enable: function() {
        this.enabled = true
    },

    disable: function() {
        this.enabled = false
    },

    on_key_press: function(event) {
        switch(event.which) {
        case 102: // f
            this.toggle_flying()
            break
        case 109: // m
            this.toggle_mouse_movement_system()
            break
        }
    },

    on_key_down: function(event) {
        switch(event.keyCode) {
        case 38: // up
        case 87: // w
            this.up = true
            break
        case 37: // left
        case 65: // a
            this.left = true
            break
        case 40: // down
        case 83: // s
            this.down = true
            break
        case 39: // right
        case 68: // d
            this.right = true
            break
        case 32: // space
            this.space = true
            break
        case 16: // shift
            this.shift = true
            break
        }
    },

    on_key_up: function(event) {
        switch(event.keyCode) {
        case 38: // up
        case 87: // w
            this.up = false
            break
        case 37: // left
        case 65: // a
            this.left = false
            break
        case 40: // down
        case 83: // s
            this.down = false
            break
        case 39: // right
        case 68: // d
            this.right = false
            break
        case 32: // space
            this.space = false
            break
        case 16: // shift
            this.shift = false
            break
        }
    },

    look_at: function(position_vector_to_look_at) {
        var look_at = new THREE.Vector3(position_vector_to_look_at.x, position_vector_to_look_at.y, position_vector_to_look_at.z)
        look_at.sub(this.yaw.position)
        look_at.normalize()


        this.direction_object3D.lookAt(position_vector_to_look_at)

        // TODO : clear current mouse movement buffers


        //this.yaw.lookAt(position_vector_to_look_at)
        //this.pitch.lookAt(position_vector_to_look_at)

        //this.yaw.rotation.y   = look_at.y * TWO_PIE
        //this.pitch.rotation.x = look_at.x * TWO_PIE
    },

    update_mouse_view_position: function() {
        if (this.buffer_mouse_movement) {
            this.yaw.rotation.y = this.mouse_movement_x_buffer.get_current_value()
            this.pitch.rotation.x = this.mouse_movement_y_buffer.get_current_value()
        }

        this.pitch.rotation.x = Math.max(-this.max_view_angle, Math.min(this.max_view_angle, this.pitch.rotation.x))

        this.direction_vector = this.get_direction()
        this.direction_vector.normalize()

        this.left_right = new THREE.Vector3(0, 1, 0)
        this.left_right.cross(this.direction_vector)
        this.left_right.normalize()

        if (!this.flying_on) {
            this.walking_direction = new THREE.Vector3(this.direction_vector.x, this.direction_vector.y, this.direction_vector.z)
            this.walking_direction = this.walking_direction.projectOnPlane(this.ground_normal)
            this.walking_direction.normalize()
        }

        // Now actually update the camera.
        this.direction_object3D.rotation.set(this.direction_vector)
    },

    on_mouse_move: function(event) {
        console.log('Rotation Y : ' + this.yaw.rotation.y)
        console.log('Rotation X : ' + this.pitch.rotation.x)
        console.log('---')

        if (this.enabled) {
            var movement_x = event.movementX || event.mozMovementX || event.webkitMovementX || 0
            var movement_y = event.movementY || event.mozMovementY || event.webkitMovementY || 0

            if (this.buffer_mouse_movement) {
                this.mouse_movement_x_buffer.add_force(movement_x * -0.002)
                this.mouse_movement_y_buffer.add_force(movement_y * -0.002)
            } else {
                this.yaw.rotation.y   -= movement_x * 0.002
                this.pitch.rotation.x -= movement_y * 0.002
            }
        }
    },

    get_object: function() {
        return this.direction_object3D
        //return this.yaw
    },

    get_direction: function() {
        var direction = new THREE.Vector3(0, 0, -1)
        var rotation  = new THREE.Euler(this.pitch.rotation.x, this.yaw.rotation.y, 0, 'YXZ')
        return direction.applyEuler(rotation)
    }

}