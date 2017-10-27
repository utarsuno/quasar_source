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

            this.key_down_buffer = []
            // Hook for mouse click.
            document.addEventListener('click', this.click_handler.bind(this))
        } else {
            console.log('Pointer lock is not supported!')
            // TODO : Throw an exception here / display error status to user.
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

            var currently_looked_at_object = WORLD_MANAGER.current_world.currently_looked_at_object
            if (currently_looked_at_object !== null) {
                currently_looked_at_object.is_engaged()
                currently_looked_at_object.disengage()
            }

            PAUSED_MENU.make_visible()
        }
    },

    pointer_lock_error: function() {
        console.log('Pointer lock error!')
        // TODO : Throw an exception here / display error status to user.
    },

    click_handler: function(e) {
        // TODO : Optimize this later

        var current_milliseconds = new Date().getTime()

        for (var i = this.key_down_buffer.length; i--;) {
            if (current_milliseconds - this.key_down_buffer[i] >= 300) {
                this.key_down_buffer.splice(i, 1)
            }
        }

        this.key_down_buffer.push(current_milliseconds)

        // Single click event.
        if (this.key_down_buffer.length == 1) {
            if (this.currently_locked !== false) {
                switch(e.button) {
                case MOUSE_LEFT_CLICK:
                    WORLD_MANAGER.current_world.single_left_click()
                    break
                case MOUSE_MIDDLE_CLICK:
                    WORLD_MANAGER.current_world.single_middle_click()
                    break
                case MOUSE_RIGHT_CLICK:
                    WORLD_MANAGER.current_world.single_right_click()
                    break
                }
            }
            // Double click event.
        } else if (this.key_down_buffer.length == 2) {
            this.try_to_enable()
        }
    },

    try_to_enable: function() {
        if (this.currently_locked === false) {
            this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock
            this.element.requestPointerLock()
        }
    }

}