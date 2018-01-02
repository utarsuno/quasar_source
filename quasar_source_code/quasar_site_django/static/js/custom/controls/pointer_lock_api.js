'use strict';

// https://www.html5rocks.com/en/tutorials/pointerlock/intro/

function PointerLockAPI(controls) {
    this.__init__(controls);
}

PointerLockAPI.prototype = {
    has_pointer_lock: null,
    element         : null,
    currently_locked: false,
    controls        : null,

    __init__: function (controls) {
        this.controls = controls;
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
        if (document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element) {
            this.currently_locked = true;

            // Only enable the controls if the Typing GUI isn't displayed.
            if (!GUI_TYPING_INTERFACE.is_visible()) {
                this.controls.enable();
            }
        } else {
            this.currently_locked = false;
            this.controls.disable();
            CURRENT_PLAYER.disengage();

            var currently_looked_at_object = MANAGER_WORLD.current_world.currently_looked_at_object;
            if (currently_looked_at_object !== null) {
                currently_looked_at_object.is_engaged();
                currently_looked_at_object.disengage();
            }

            GUI_PAUSED_MENU.make_visible();
        }
    },

    pointer_lock_error: function() {
        raise_exception_with_full_logging('Pointer lock error!');
    },

    try_to_enable: function() {
        if (this.currently_locked === false) {
            this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;
            this.element.requestPointerLock();
            GUI_PAUSED_MENU.make_invisible();
        }
    }

};