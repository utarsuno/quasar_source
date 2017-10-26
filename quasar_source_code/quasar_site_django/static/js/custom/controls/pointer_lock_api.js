'use strict'

// https://www.html5rocks.com/en/tutorials/pointerlock/intro/

function PointerLockAPI(controls) {
    this.__init__(controls)
}

PointerLockAPI.prototype = {
    has_pointer_lock: null,
    element         : null,
    currently_locked: false,
    controls        : null,

    l_key_currently_down: false,

    // Needed for detecting double clicks.
    key_down_buffer: null,

    __init__: function (controls) {
        this.controls = controls
        this.element = document.body
        this.has_pointer_lock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
        if (this.has_pointer_lock === true) {
            //console.log('Pointer lock is supported!')

            // Hook pointer lock state change events.
            document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), false)
            document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), false)
            document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), false)
            // Hook pointer lock error events.
            document.addEventListener('pointerlockerror', this.pointer_lock_error.bind(this), false)
            document.addEventListener('mozpointerlockerror', this.pointer_lock_error.bind(this), false)
            document.addEventListener('webkitpointerlockerror', this.pointer_lock_error.bind(this), false)

            // TODO : Move the 3 listeners below into the Player class

            // Hook for mouse click.
            //document.addEventListener('click', this.mouse_click.bind(this), false)

            this.key_down_buffer = []

            document.addEventListener('click', this.click_handler.bind(this))

            // Hook for key down presses.
            document.addEventListener('keydown', this.key_down.bind(this), false)
            // Hook for key up presses.
            document.addEventListener('keyup', this.key_up.bind(this), false)




        } else {
            console.log('Pointer lock is not supported!')
        }
    },

    pointer_lock_change: function () {
        if (document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element) {
            this.currently_locked = true
            this.controls.enable()
        } else {
            this.currently_locked = false
            this.controls.disable()
            WORLD_MANAGER.player.disengage()
        }
    },

    pointer_lock_error: function() {
        console.log('Pointer lock error!')
    },

    // mouse_click_single: function() {}, // No functionality yet so not included.

    click_handler: function() {
        // TODO : Optimize this later

        var current_milliseconds = new Date().getTime()

        for (var i = this.key_down_buffer.length; i--;) {
            if (current_milliseconds - this.key_down_buffer[i] >= 300) {
                this.key_down_buffer.splice(i, 1)
            }
        }

        this.key_down_buffer.push(current_milliseconds)

        if (this.key_down_buffer.length == 1) {
            WORLD_MANAGER.current_world.single_click()
        } else if (this.key_down_buffer.length == 2) {
            if (this.currently_locked === false) {
                this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock
                this.element.requestPointerLock()
            }
        }
    },

    key_down: function(event) {
        if (event.which == KEY_CODE_L) {
            this.l_key_currently_down = true
        }
    },

    key_up: function(event) {
        if (event.which == KEY_CODE_L) {
            this.l_key_currently_down = false
        }
    }
}