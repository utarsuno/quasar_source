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
        this.flying_on = false

        this.velocity = new THREE.Vector3()

        document.addEventListener('mousemove', this.on_mouse_move.bind(this), false)
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        document.addEventListener('keyup', this.on_key_up.bind(this), false)
    },

    physics: function(delta) {
        if (this.enabled) {

            //console.log(this.camera.getWorldDirection().x + ', ' + this.camera.getWorldDirection().y + ', ' + this.camera.getWorldDirection().z)
            //console.log(' ')


            /*
            // Walking mode.
            if (this.flying_on === false) {
                this.direction_vector = new THREE.Vector3(this.camera.getWorldDirection().x, this.camera.getWorldDirection().y, this.camera.getWorldDirection().z)

                console.log('The ground normal is : ')
                console.log(this.ground_normal)
                this.ground_vector = this.direction_vector.projectOnPlane(this.ground_normal)
                this.ground_vector.normalize()
                //var ground_vector =
                console.log('x: ' + this.ground_vector.x + ', y: ' + this.ground_vector.y + ', z: ' + this.ground_vector.z)

            } else {
                // Flying mode.
                this.direction_vector = new THREE.Vector3(this.camera.getWorldDirection().x, this.camera.getWorldDirection().y, this.camera.getWorldDirection().z)

            }*/

            // Oh just realized the vector direction system needed..., going to use old one in mean time

            if (this.up) {
                //this.velocity.z -= this.ground_vector.x * 400.0 * delta
                //this.velocity.x -= this.ground_vector.z * 400.0 * delta
                this.velocity.z -= 400.0 * delta
            }
            if (this.down) {
                //this.velocity.z += this.direction_vector.z * 400.0 * delta
                this.velocity.z += 400.0 * delta
            }
            if (this.left) {
                //this.velocity.x -= this.direction_vector.x * 400.0 * delta
                this.velocity.x -= 400.0 * delta
            }
            if (this.right) {
                //this.velocity.x += this.direction_vector.x * 400.0 * delta
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