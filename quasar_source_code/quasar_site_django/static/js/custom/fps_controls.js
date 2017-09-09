'use strict'

function FPSControls(camera) {
    this.__init__(camera)
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

    flying_on    : null,

    // Camera view.
    max_upward_view: null,
    max_downward_view: null,

    __init__: function (camera) {
        // Constants.
        this.half_pie = Math.PI / 2
        this.max_view_angle = this.half_pie * 0.9

        this.camera = camera
        this.camera.rotation.set(0, 0, 0)

        this.pitch = new THREE.Object3D()
        this.pitch.add(camera)

        this.yaw = new THREE.Object3D()
        this.yaw.position.y = 10
        this.yaw.add(this.pitch)

        this.enabled = false

        this.velocity = new THREE.Vector3()

        document.addEventListener('mousemove', this.on_mouse_move.bind(this), false)
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        document.addEventListener('keyup', this.on_key_up.bind(this), false)
    },

    physics: function(delta) {
        if (this.enabled) {

            // Walking mode.
            if (this.flying_on === false) {

                var direction_vector = new THREE.Vector3()

            } else {
                // Flying mode.

            }

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
            this.velocity.x -= this.velocity.x * 10.0 * delta
            this.velocity.z -= this.velocity.z * 10.0 * delta
            this.yaw.translateX(this.velocity.x * delta)
            this.yaw.translateY(this.velocity.y * delta)
            this.yaw.translateZ(this.velocity.z * delta)
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

    get_object: function() {
        return this.yaw
    },

    get_direction: function() {
        var direction = new THREE.Vector3(0, 0, -1)
        var rotation  = new THREE.Euler(0, 0, 0, 'YXZ')
        return function(v) {
            rotation.set(this.pitch.rotation.x, this.yaw.rotation.y, 0)
            v.copy(direction).applyEuler(rotation)
            return v
        }
    }
}