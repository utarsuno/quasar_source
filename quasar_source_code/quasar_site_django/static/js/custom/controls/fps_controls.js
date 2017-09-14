'use strict'

function FPSControls(camera, ground_normal) {
    this.__init__(camera, ground_normal)
}

FPSControls.prototype = {
    camera       : null,
    pitch        : null,
    yaw          : null,
    half_pie     : null,
    enabled      : null,

    // Movement.
    up           : null,
    down         : null,
    left         : null,
    right        : null,

    velocity     : null,
    acceleration : null,

    // Flying movement.
    flying_on    : null,

    // Camera view.
    max_upward_view: null,
    max_downward_view: null,

    direction_vector: null,


    ground_normal: null,
    ground_vector: null,

    __init__: function (camera, ground_normal) {
        // Constants.
        this.half_pie = Math.PI / 2
        this.max_view_angle = this.half_pie * 0.9
        this.ground_normal = ground_normal
        console.log('GROUND NORMAL IS NOW SET TO : ' + this.ground_normal)


        var exampleA = new THREE.Vector3(1, 2, 3)
        var exampleN = new THREE.Vector3(4, 5, 6)
        exampleN.normalize()
        console.log(exampleN)
        console.log(exampleA.projectOnPlane(exampleN))

        this.camera = camera
        this.camera.rotation.set(0, 0, 0)

        this.pitch = new THREE.Object3D()
        this.pitch.add(camera)

        this.yaw = new THREE.Object3D()
        this.yaw.position.y = 10
        this.yaw.add(this.pitch)

        this.enabled = false
        this.flying_on = true

        this.velocity = new THREE.Vector3()

        document.addEventListener('keypress', this.on_key_press.bind(this), false)
        document.addEventListener('mousemove', this.on_mouse_move.bind(this), false)
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        document.addEventListener('keyup', this.on_key_up.bind(this), false)
    },

    physics: function(delta) {
        if (this.enabled) {

            this.direction_vector = this.get_direction()
            this.direction_vector.normalize()

            var left_right = new THREE.Vector3(0, 1, 0)
            left_right.cross(this.direction_vector)

            // Oh just realized the vector direction system needed..., going to use old one in mean time

            if (this.flying_on) {

                if (this.space) {
                    this.velocity.y += 200.0 * delta
                }
                if (this.shift) {
                    this.velocity.y -= 200.0 * delta
                }

                if (this.up) {
                    this.velocity.x += 200 * delta * this.direction_vector.x
                    this.velocity.y += 200 * delta * this.direction_vector.y
                    this.velocity.z += 200 * delta * this.direction_vector.z
                }

                if (this.down) {
                    this.velocity.x -= 200 * delta * this.direction_vector.x
                    this.velocity.y -= 200 * delta * this.direction_vector.y
                    this.velocity.z -= 200 * delta * this.direction_vector.z
                }

                if (this.left) {
                    this.velocity.x += 200 * delta * left_right.x
                    this.velocity.y += 200 * delta * left_right.y
                    this.velocity.z += 200 * delta * left_right.z
                }

                if (this.right) {
                    this.velocity.x -= 200 * delta * left_right.x
                    this.velocity.y -= 200 * delta * left_right.y
                    this.velocity.z -= 200 * delta * left_right.z
                }

                this.velocity.x *= (1 - delta * 15)
                this.velocity.y *= (1 - delta * 15)
                this.velocity.z *= (1 - delta * 15)

                this.yaw.position.x += this.velocity.x
                this.yaw.position.y += this.velocity.y
                this.yaw.position.z += this.velocity.z

            } else {

                // TODO : Now fix the 2D movement system.

                if (this.up) {
                    this.velocity.z -= 400.0 * delta
                }
                if (this.down) {
                    this.velocity.z += 400.0 * delta
                }
                if (this.left) {
                    this.velocity.x -= 400.0 * delta
                }
                if (this.right) {
                    this.velocity.x += 400.0 * delta
                }
                this.velocity.x -= this.velocity.x * 4.0 * delta
                this.velocity.z -= this.velocity.z * 4.0 * delta

                if (this.velocity.y != 0) {
                    this.velocity.y -= 9.8 * delta
                }

                //this.velocity.x -= this.velocity.x * 10.0 * delta
                //this.velocity.z -= this.velocity.z * 10.0 * delta

                this.yaw.translateX(this.velocity.x * delta)
                this.yaw.translateY(this.velocity.y * delta)
                this.yaw.translateZ(this.velocity.z * delta)

                if (this.yaw.position.y <= 10) {
                    this.yaw.position.y = 10
                    this.velocity.y = 0
                }

            }
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
        //console.log('Key pressed')
        //console.log(event)
        switch(event.which) {
        case 102: // f
            this.flying_on = !this.flying_on
            console.log('Flying toggled to : ' + this.flying_on)
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

    get_yaw: function() {
        return this.yaw.rotation.y
    },

    get_pitch: function() {
        return this.pitch.rotation.x
    },

    on_mouse_move: function(event) {
        if (this.enabled) {
            var movement_x = event.movementX || event.mozMovementX || event.webkitMovementX || 0
            var movement_y = event.movementY || event.mozMovementY || event.webkitMovementY || 0

            this.yaw.rotation.y   -= movement_x * 0.002
            this.pitch.rotation.x -= movement_y * 0.002

            this.pitch.rotation.x = Math.max( - this.max_view_angle, Math.min(this.max_view_angle, this.pitch.rotation.x))
        }
    },

    get_x_rotation: function() {
        return this.pitch.rotation.x
    },

    get_object: function() {
        return this.yaw
    },

    get_direction: function() {
        var direction = new THREE.Vector3(0, 0, -1)
        var rotation  = new THREE.Euler(this.pitch.rotation.x, this.yaw.rotation.y, 0, 'YXZ')
        return direction.applyEuler(rotation)
    }

}