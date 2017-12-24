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

    // Needed for detecting double clicks.
    key_down_buffer: null,

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

            document.addEventListener('mousedown', this.on_mouse_down.bind(this), false);
            document.addEventListener('mouseup', this.on_mouse_up.bind(this), false);

            this.right_click_down = false;

            this.key_down_buffer = [];
            // Hook for mouse click.
            document.addEventListener('click', this.click_handler.bind(this));
        } else {
            // FOR_DEV_START
            l('Pointer lock is not supported!');
            // FOR_DEV_END
            GUI_TYPING_INTERFACE.add_server_message('Pointer lock is not supported!');
            raise_exception('Pointer lock is not supported!');
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
        // FOR_DEV_START
        l('Pointer lock error!');
        // FOR_DEV_END
        GUI_TYPING_INTERFACE.add_server_message('Pointer lock error!');
    },

    // Code from : https://stackoverflow.com/questions/9521519/how-can-i-detect-a-rightmouse-button-event-on-mousedown
    on_mouse_down: function(e) {
        e = e || window.event;
        switch (e.which) {
        case 1:
            this.left_click_down = true;
            break;
        case 2:
            this.middle_click_down = true;
            break;
        case 3:
            if (!this.right_click_down) {
                if (!is_defined(MANAGER_WORLD.current_world.currently_looked_at_object)) {
                    MANAGER_WORLD.current_player_menu.set_to_visible();
                }
            }
            this.right_click_down = true;
            break;
        }
    },

    on_mouse_up: function(e) {
        e = e || window.event;
        switch (e.which) {
        case 1:
            this.left_click_down = false;
            break;
        case 2:
            this.middle_click_down = false;
            break;
        case 3:
            if (MANAGER_WORLD.current_player_menu.is_visible()) {
                MANAGER_WORLD.current_player_menu.set_to_invisible();
            }
            this.right_click_down = false;
            break;
        }
    },

    click_handler: function(e) {
        // TODO : Optimize this later

        var current_milliseconds = new Date().getTime();

        for (var i = this.key_down_buffer.length; i--;) {
            if (current_milliseconds - this.key_down_buffer[i] >= 300) {
                this.key_down_buffer.splice(i, 1);
            }
        }

        this.key_down_buffer.push(current_milliseconds);

        // Single click event.
        if (this.key_down_buffer.length === 1) {
            if (this.currently_locked !== false) {
                switch(e.button) {
                case MOUSE_LEFT_CLICK:
                    MANAGER_WORLD.current_world.single_left_click();
                    break;
                case MOUSE_MIDDLE_CLICK:
                    MANAGER_WORLD.current_world.single_middle_click();
                    break;
                case MOUSE_RIGHT_CLICK:
                    MANAGER_WORLD.current_world.single_right_click();
                    break;
                }
            }
            // Double click event.
        } else if (this.key_down_buffer.length == 2) {
            this.try_to_enable();
        }
    },

    try_to_enable: function() {
        if (this.currently_locked === false) {
            this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;
            this.element.requestPointerLock();
            GUI_PAUSED_MENU.make_invisible();
        }
    }

};