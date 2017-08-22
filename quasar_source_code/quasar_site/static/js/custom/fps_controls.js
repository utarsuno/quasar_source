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
    forward      : null,
    backward     : null,
    left         : null,
    right        : null,
    velocity     : null,
    acceleration : null,

    __init__: function (camera) {
        this.half_pie = Math.PI / 2

        this.camera = camera
        this.camera.rotation.set(0, 0, 0)

        this.pitch = new THREE.Object3D()
        this.pitch.add(camera)

        this.yaw = new THREE.Object3D()
        this.yaw.position.y = 5
        this.yaw.add(this.pitch)

        this.enabled = false

        this.velocity = new THREE.Vector3()

        document.addEventListener('onMouseMove', this.on_mouse_move.bind(this), false)
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        document.addEventListener('keyup', this.on_key_up.bind(this), false)
    },

    physics: function(delta) {
        this.velocity.x -= this.velocity.x * 10.0 * delta
        this.velocity.y -= this.velocity.y * 10.0 * delta
        this.yaw.translateX(this.velocity.x * delta)
        this.yaw.translateY(this.velocity.y * delta)
        this.yaw.translateZ(this.velocity.z * delta)
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
            this.forward = true
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
            this.forward = false
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

    on_mouse_move: function(event) {
        if (this.enabled === true) {
            var movement_x = event.movementX || event.mozMovementX || event.webkitMovementX || 0
            var movement_y = event.movementY || event.mozMovementY || event.webkitMovementY || 0

            this.yaw.rotation.y -= movement_x * 0.002
            this.pitch.rotation.x -= movement_y * 0.002

            this.pitch.rotation.x = Math.max( - this.half_pie, Math.min( this.half_pie, this.pitch.rotation.x))
        }
    },

    get_object: function() {
        return this.yaw
    },

    get_direction: function() {
        var direction = new THREE.Vector3(0, 0, -1)
        var rotation  = new THREE.Euler(0, 0, 0, 'YXZ')
        return function( v ) {
            rotation.set( this.pitch.rotation.x, this.yaw.rotation.y, 0 )
            v.copy(direction).applyEuler(rotation)
            return v
        }
    }
}