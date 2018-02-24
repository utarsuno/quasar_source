'use strict';

// https://www.html5rocks.com/en/tutorials/pointerlock/intro/

function PointerLockManager() {
    this.__init__();
}

PointerLockManager.prototype = {
    __init__: function () {
        this.element = document.body;
        this.has_pointer_lock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if (this.has_pointer_lock === true) {
            //console.log('Pointer lock is supported!')

            // Hook pointer lock state change events.
            document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), false);
            document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), false);
            document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), false);
            // Hook pointer lock error events.
            document.addEventListener('pointerlockerror', this.pointer_lock_error.bind(this), false);
            document.addEventListener('mozpointerlockerror', this.pointer_lock_error.bind(this), false);
            document.addEventListener('webkitpointerlockerror', this.pointer_lock_error.bind(this), false);
        } else {
            raise_exception_with_full_logging('Pointer lock is not supported!');
        }
    },

    pointer_lock_change: function () {
        //l('Pointer lock change!');

        if (document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element) {

            // TODO : Delete this code?
            /*
            this.currently_locked = true;
            // Only enable the controls if the Typing GUI isn't displayed.
            if (!GUI_TYPING_INTERFACE.is_visible()) {
                CURRENT_PLAYER.fps_controls.enable();
            }
            */

        } else {
            l('Set to paused!!!');
            CURRENT_PLAYER.set_state(PLAYER_STATE_PAUSED);
        }
    },

    pointer_lock_error: function(e) {
        raise_exception_with_full_logging('Pointer lock error!');
    },

    request_pointer_lock: function() {
        this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;
        this.element.requestPointerLock();
    }

};