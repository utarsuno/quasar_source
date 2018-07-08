'use strict';

// Key-down key-codes.
const KEY_CODE__SHIFT      = 16;           // #pre-process_global_constant
const KEY_CODE__SPACE      = 32;           // #pre-process_global_constant
const KEY_CODE__UP         = 38;           // #pre-process_global_constant
const KEY_CODE__LEFT       = 37;           // #pre-process_global_constant
const KEY_CODE__RIGHT      = 39;           // #pre-process_global_constant
const KEY_CODE__DOWN       = 40;           // #pre-process_global_constant
const KEY_CODE_0           = 48;           // #pre-process_global_constant
const KEY_CODE_1           = 49;           // #pre-process_global_constant
const KEY_CODE_2           = 50;           // #pre-process_global_constant
const KEY_CODE_3           = 51;           // #pre-process_global_constant
const KEY_CODE_4           = 52;           // #pre-process_global_constant
const KEY_CODE_5           = 53;           // #pre-process_global_constant
const KEY_CODE_6           = 54;           // #pre-process_global_constant
const KEY_CODE_7           = 55;           // #pre-process_global_constant
const KEY_CODE_8           = 56;           // #pre-process_global_constant
const KEY_CODE_9           = 57;           // #pre-process_global_constant
const KEY_CODE_A           = 65;           // #pre-process_global_constant
const KEY_CODE_B           = 66;           // #pre-process_global_constant
const KEY_CODE_C           = 67;           // #pre-process_global_constant
const KEY_CODE_D           = 68;           // #pre-process_global_constant
const KEY_CODE_E           = 69;           // #pre-process_global_constant
const KEY_CODE_F           = 70;           // #pre-process_global_constant
const KEY_CODE_G           = 71;           // #pre-process_global_constant
const KEY_CODE_H           = 72;           // #pre-process_global_constant
const KEY_CODE_I           = 73;           // #pre-process_global_constant
const KEY_CODE_J           = 74;           // #pre-process_global_constant
const KEY_CODE_K           = 75;           // #pre-process_global_constant
const KEY_CODE_L           = 76;           // #pre-process_global_constant
const KEY_CODE_M           = 77;           // #pre-process_global_constant
const KEY_CODE_N           = 78;           // #pre-process_global_constant
const KEY_CODE_O           = 79;           // #pre-process_global_constant
const KEY_CODE_P           = 80;           // #pre-process_global_constant
const KEY_CODE_Q           = 81;           // #pre-process_global_constant
const KEY_CODE_R           = 82;           // #pre-process_global_constant
const KEY_CODE_S           = 83;           // #pre-process_global_constant
const KEY_CODE_T           = 84;           // #pre-process_global_constant
const KEY_CODE_U           = 85;           // #pre-process_global_constant
const KEY_CODE_V           = 86;           // #pre-process_global_constant
const KEY_CODE_W           = 87;           // #pre-process_global_constant
const KEY_CODE_X           = 88;           // #pre-process_global_constant
const KEY_CODE_Y           = 89;           // #pre-process_global_constant
const KEY_CODE_Z           = 90;           // #pre-process_global_constant
const KEY_CODE__DELETE     = 8;            // #pre-process_global_constant
const KEY_CODE__TAB        = 9;            // #pre-process_global_constant
const KEY_CODE__ENTER      = 13;           // #pre-process_global_constant
const KEY_CODE__CONTROL    = 17;           // #pre-process_global_constant
const KEY_CODE__BACK_SLASH = 220;          // #pre-process_global_constant

const EVENT_MOUSE_DOWN = 'mousedown';      // #pre-process_global_constant
const EVENT_MOUSE_UP   = 'mouseup';        // #pre-process_global_constant
const EVENT_KEY_DOWN   = 'keydown';        // #pre-process_global_constant
const EVENT_KEY_UP     = 'keyup';          // #pre-process_global_constant
const EVENT_MOUSE_MOVE = 'mousemove';      // #pre-process_global_constant
const EVENT_PASTE      = 'paste';          // #pre-process_global_constant
const EVENT_WHEEL_V0   = 'wheel';          // #pre-process_global_constant
const EVENT_WHEEL_V1   = 'mousewheel';     // #pre-process_global_constant
const EVENT_WHEEL_V2   = 'DOMMouseScroll'; // #pre-process_global_constant

function InputManager() {
    this.__init__();
}

InputManager.prototype = {

    __init__: function() {
        this.click_down_left   = false;
        this.click_down_right  = false;
        this.click_down_middle = false;
        this.up 			   = false;
        this.down   		   = false;
        this.left 			   = false;
        this.right 			   = false;
        this.space  		   = false;
        this.shift  		   = false;

        this.CLICK_LEFT   = 1;
        this.CLICK_MIDDLE = 2;
        this.CLICK_RIGHT  = 3;

        document.addEventListener(EVENT_MOUSE_DOWN, this.on_mouse_down.bind(this), true);
        document.addEventListener(EVENT_MOUSE_UP  , this.on_mouse_up.bind(this), true);
        document.addEventListener(EVENT_KEY_DOWN  , this.on_key_down.bind(this), true);
        document.addEventListener(EVENT_KEY_UP    , this.on_key_up.bind(this), true);
        document.addEventListener(EVENT_PASTE     , this.on_paste.bind(this), true);

        document.addEventListener(EVENT_MOUSE_MOVE, this.on_mouse_move.bind(this));

        // Cross browser support for wheel events.
        // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript

        // TODO : Double check to only add one of them and not all 3 if all 3 are supported.
        document.addEventListener(EVENT_WHEEL_V0  , this.on_wheel_event.bind(this), true);
        document.addEventListener(EVENT_WHEEL_V1  , this.on_wheel_event.bind(this), true);
        document.addEventListener(EVENT_WHEEL_V2  , this.on_wheel_event.bind(this), true);

        /* The flag that determines whether the wheel event is supported. */
        this.supports_wheel = false;

        if (CURRENT_CLIENT.is_mobile) {
            // Inherit needed mobile controls.
            MobileInputManager.call(this);
            //MobileButtonManager.call(this);
            MobileKeyboard.call(this);
        } else {
            // Check if the desktop client has touch controls in order to disable pinch zoom events.
            if ('ontouchstart' in window) {
                l('DESKTOP CLIENT HAS ONTOUCHSTART');
                MobileInputManager.call(this);
            }
        }
    },

    reset_movement_controls: function() {
        this.up    = false;
        this.down  = false;
        this.left  = false;
        this.right = false;
        this.space = false;
        this.shift = false;
    },

    reset: function() {
        this.click_down_left   = false;
        this.click_down_right  = false;
        this.click_down_middle = false;
        this.up 			   = false;
        this.down   		   = false;
        this.left 			   = false;
        this.right 			   = false;
        this.space  		   = false;
        this.shift  		   = false;
    },

    on_paste: function(event) {
        if (CURRENT_PLAYER.has_paste_event()) {
            // Code help from : https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
            let clipboard_data = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
            let pasted_data = clipboard_data.getData('text');
            MANAGER_WORLD.current_world.currently_looked_at_object.parse_text(pasted_data);
        }

        event.preventDefault();
        event.stopPropagation();
    },

    _mouse_movement: function(x, y) {
        if (CURRENT_PLAYER.has_mouse_movement()) {
            CURRENT_PLAYER.fps_controls.on_mouse_move(x, y);
        }
    },

    on_mouse_move: function(event) {
        this._mouse_movement(event.movementX || event.mozMovementX || event.webkitMovementX || 0, event.movementY || event.mozMovementY || event.webkitMovementY || 0);

        // TODO : Not currently used for now.
        /*
           // Only left click dragging will be supported for now.
           if (this.click_down_left) {
                MANAGER_WORLD.current_world.parse_mouse_drag(movement_x, movement_y);
            } else {
                MANAGER_WORLD.current_world.parse_mouse_movement(movement_x, movement_y);
            }
        */
        event.preventDefault();
        event.stopPropagation();
    },

    on_key_down: function(event) {
        //event.preventDefault();
        //event.stopPropagation();
        if (CURRENT_PLAYER.has_movement()) {
            switch (event.keyCode) {
            case KEY_CODE__UP:
            case KEY_CODE_W:
                this.up = true;
                break;
            case KEY_CODE__LEFT:
            case KEY_CODE_A:
                this.left = true;
                break;
            case KEY_CODE__DOWN:
            case KEY_CODE_S:
                this.down = true;
                break;
            case KEY_CODE__RIGHT:
            case KEY_CODE_D:
                this.right = true;
                break;
            case KEY_CODE__SPACE:
                this.space = true;
                break;
            case KEY_CODE__SHIFT:
                this.shift = true;
                break;
            }
        }
        MANAGER_WORLD.key_down_event(event);
        event.preventDefault();
        event.stopPropagation();
    },

    // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
    on_wheel_event: function(event) {
        if (CURRENT_PLAYER.has_input()) {
            /* Check whether the wheel event is supported. */
            if (event.type == 'wheel') this.supports_wheel = true;
            else if (this.supports_wheel) return;

            /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
            MANAGER_WORLD.current_world.wheel_event(((event.deltaY || -event.wheelDelta || event.detail) >> 10) || 1);
        }
        event.preventDefault();
        event.stopPropagation();
    },

    on_key_up: function(event) {
        if (CURRENT_PLAYER.has_movement()) {
            switch (event.keyCode) {
            case KEY_CODE__UP:
            case KEY_CODE_W:
                this.up = false;
                break;
            case KEY_CODE__LEFT:
            case KEY_CODE_A:
                this.left = false;
                break;
            case KEY_CODE__DOWN:
            case KEY_CODE_S:
                this.down = false;
                break;
            case KEY_CODE__RIGHT:
            case KEY_CODE_D:
                this.right = false;
                break;
            case KEY_CODE__SPACE:
                this.space = false;
                break;
            case KEY_CODE__SHIFT:
                this.shift = false;
                break;
            }
        }
        event.preventDefault();
        event.stopPropagation();
    },

    on_mouse_up: function(event) {
        event = event || window.event;
        switch (event.which) {
        case this.CLICK_LEFT:
            this.click_down_left = false;
            MANAGER_WORLD.left_click_up();
            break;
        case this.CLICK_MIDDLE:
            MANAGER_WORLD.middle_click_up();
            this.click_down_middle = false;
            break;
        case this.CLICK_RIGHT:
            MANAGER_WORLD.right_click_up();
            this.click_down_right = false;
            break;
        }
        event.preventDefault();
        event.stopPropagation();
    },

    on_mouse_down: function(event) {
        event = event || window.event;
        switch (event.which) {
        case this.CLICK_LEFT:
            MANAGER_WORLD.left_click_down();
            this.click_down_left = true;
            break;
        case this.CLICK_MIDDLE:
            MANAGER_WORLD.middle_click_down();
            this.click_down_middle = true;
            break;
        case this.CLICK_RIGHT:
            MANAGER_WORLD.right_click_down();
            this.click_down_right = true;
            break;
        }
        event.preventDefault();
        event.stopPropagation();
    }

};