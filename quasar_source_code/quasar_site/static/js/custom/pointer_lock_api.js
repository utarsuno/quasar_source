'use strict'

// https://www.html5rocks.com/en/tutorials/pointerlock/intro/

function PointerLockAPI() {
    this.initialize()
    PointerLockAPI.prototype.self = this
}

PointerLockAPI.prototype = {
    self: null,
    has_pointer_lock: null,
    _request_pointer_lock_function: null,
    element: null,
    currently_locked: null,
    initialize: function () {
        this.self    = this
        this.element = document.body
        this.has_pointer_lock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
        if (this.has_pointer_lock === true) {
            console.log('Pointer lock is supported!')
            // Hook pointer lock state change events.
            document.addEventListener('pointerlockchange', this.pointer_lock_change, false)
            document.addEventListener('mozpointerlockchange', this.pointer_lock_change, false)
            document.addEventListener('webkitpointerlockchange', this.pointer_lock_change, false)
            // Hook pointer lock error events.
            document.addEventListener('pointerlockerror', this.pointer_lock_error, false)
            document.addEventListener('mozpointerlockerror', this.pointer_lock_error, false)
            document.addEventListener('webkitpointerlockerror', this.pointer_lock_error, false)

            // Hook for mouse click.
            document.addEventListener('click', this.mouse_click, false)
        } else {
            console.log('Pointer lock is not supported!')
        }
    },
    pointer_lock_change: function () {
        if (document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element) {
            // Pointer was just locked.
            this.currently_locked = true
            console.log('Pointer just locked!')
        } else {
            this.currently_locked = false
            console.log('Pointer just unlocked!')
        }
    },
    pointer_lock_error: function() {
        console.log('Pointer lock error!')
    },
    mouse_click: function() {
        var element = document.body
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
        element.requestPointerLock()
    }
}