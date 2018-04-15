'use strict';

// Key-down key-codes.
const KEY_CODE_SHIFT      = 16;
const KEY_CODE_SPACE      = 32;
const KEY_CODE_UP         = 38;
const KEY_CODE_LEFT       = 37;
const KEY_CODE_RIGHT      = 39;
const KEY_CODE_DOWN       = 40;
const KEY_CODE_0          = 48;
const KEY_CODE_1          = 49;
const KEY_CODE_2          = 50;
const KEY_CODE_3          = 51;
const KEY_CODE_4          = 52;
const KEY_CODE_5          = 53;
const KEY_CODE_6          = 54;
const KEY_CODE_7          = 55;
const KEY_CODE_8          = 56;
const KEY_CODE_9          = 57;
const KEY_CODE_A          = 65;
const KEY_CODE_B          = 66;
const KEY_CODE_C          = 67;
const KEY_CODE_D          = 68;
const KEY_CODE_E          = 69;
const KEY_CODE_F          = 70;
const KEY_CODE_G          = 71;
const KEY_CODE_H          = 72;
const KEY_CODE_I          = 73;
const KEY_CODE_J          = 74;
const KEY_CODE_K          = 75;
const KEY_CODE_L          = 76;
const KEY_CODE_M          = 77;
const KEY_CODE_N          = 78;
const KEY_CODE_O          = 79;
const KEY_CODE_P          = 80;
const KEY_CODE_Q          = 81;
const KEY_CODE_R          = 82;
const KEY_CODE_S          = 83;
const KEY_CODE_T          = 84;
const KEY_CODE_U          = 85;
const KEY_CODE_V          = 86;
const KEY_CODE_W          = 87;
const KEY_CODE_X          = 88;
const KEY_CODE_Y          = 89;
const KEY_CODE_Z          = 90;
const KEY_CODE_DELETE     = 8;
const KEY_CODE_TAB        = 9;
const KEY_CODE_ENTER      = 13;
const KEY_CODE_CONTROL    = 17;
const KEY_CODE_BACK_SLASH = 220;

const EVENT_MOUSE_DOWN = 'mousedown';
const EVENT_MOUSE_UP   = 'mouseup';
const EVENT_KEY_DOWN   = 'keydown';
const EVENT_KEY_UP     = 'keyup';
const EVENT_MOUSE_MOVE = 'mousemove';
const EVENT_PASTE      = 'paste';
const EVENT_WHEEL_V0   = 'wheel';
const EVENT_WHEEL_V1   = 'mousewheel';
const EVENT_WHEEL_V2   = 'DOMMouseScroll';

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

        document.addEventListener(EVENT_MOUSE_DOWN, this.on_mouse_down.bind(this));
        document.addEventListener(EVENT_MOUSE_UP  , this.on_mouse_up.bind(this));
        document.addEventListener(EVENT_KEY_DOWN  , this.on_key_down.bind(this));
        document.addEventListener(EVENT_KEY_UP    , this.on_key_up.bind(this));
        document.addEventListener(EVENT_PASTE     , this.on_paste.bind(this));

        document.addEventListener(EVENT_MOUSE_MOVE, this.on_mouse_move.bind(this));

        // Cross browser support for wheel events.
        // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript

        // TODO : Double check to only add one of them and not all 3 if all 3 are supported.
        document.addEventListener(EVENT_WHEEL_V0  , this.on_wheel_event.bind(this));
        document.addEventListener(EVENT_WHEEL_V1  , this.on_wheel_event.bind(this));
        document.addEventListener(EVENT_WHEEL_V2  , this.on_wheel_event.bind(this));

        /* The flag that determines whether the wheel event is supported. */
        this.supports_wheel = false;

        if (CURRENT_CLIENT.is_mobile) {
            // Inherit needed mobile controls.
            MobileInputManager.call(this);
            //MobileButtonManager.call(this);
            MobileKeyboard.call(this);

            this.mobile_text_input = document.getElementById('mobile_text_input');
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

    on_paste: function(e) {
        if (CURRENT_PLAYER.has_paste_event()) {
            // Code help from : https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
            var clipboard_data = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
            var pasted_data = clipboard_data.getData('text');
            MANAGER_WORLD.current_world.currently_looked_at_object.parse_text(pasted_data);
        }
    },

    _mouse_movement: function(x, y) {
        if (CURRENT_PLAYER.has_mouse_movement()) {
            CURRENT_PLAYER.fps_controls.on_mouse_move(x, y);
        }
    },

    on_mouse_move: function(event) {
        var movement_x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movement_y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        this._mouse_movement(movement_x, movement_y);

        // TODO : Not currently used for now.
        /*
           // Only left click dragging will be supported for now.
           if (this.click_down_left) {
                MANAGER_WORLD.current_world.parse_mouse_drag(movement_x, movement_y);
            } else {
                MANAGER_WORLD.current_world.parse_mouse_movement(movement_x, movement_y);
            }
        */
    },

    on_key_down: function(event) {
        if (CURRENT_PLAYER.in_typing_state()) {
            if (event.keyCode === KEY_CODE_ENTER) {
                CURRENT_PLAYER.add_text_and_leave_typing_state();
            } else {
                GUI_TYPING_INTERFACE.key_down_event(event);
            }
        } else if (CURRENT_PLAYER.has_input()) {
            if (event.keyCode === KEY_CODE_ENTER) {
                if (!CURRENT_PLAYER.engaged_with_object()) {
                    CURRENT_PLAYER.set_state(PLAYER_STATE_TYPING);
                } else {
                    MANAGER_WORLD.key_down_event(event);
                }
            } else {
                if (CURRENT_PLAYER.has_movement()) {
                    switch (event.keyCode) {
                    case KEY_CODE_UP:
                    case KEY_CODE_W:
                        this.up = true;
                        break;
                    case KEY_CODE_LEFT:
                    case KEY_CODE_A:
                        this.left = true;
                        break;
                    case KEY_CODE_DOWN:
                    case KEY_CODE_S:
                        this.down = true;
                        break;
                    case KEY_CODE_RIGHT:
                    case KEY_CODE_D:
                        this.right = true;
                        break;
                    case KEY_CODE_SPACE:
                        this.space = true;
                        break;
                    case KEY_CODE_SHIFT:
                        this.shift = true;
                        break;
                    }
                }
                MANAGER_WORLD.key_down_event(event);
            }
        }
    },

    // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
    on_wheel_event: function(e) {
        if (CURRENT_PLAYER.has_input()) {
            /* Check whether the wheel event is supported. */
            if (e.type == 'wheel') this.supports_wheel = true;
            else if (this.supports_wheel) return;

            /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
            MANAGER_WORLD.current_world.wheel_event(((e.deltaY || -e.wheelDelta || e.detail) >> 10) || 1);
        }
    },

    on_key_up: function(event) {
        if (CURRENT_PLAYER.has_movement()) {
            switch (event.keyCode) {
            case KEY_CODE_UP:
            case KEY_CODE_W:
                this.up = false;
                break;
            case KEY_CODE_LEFT:
            case KEY_CODE_A:
                this.left = false;
                break;
            case KEY_CODE_DOWN:
            case KEY_CODE_S:
                this.down = false;
                break;
            case KEY_CODE_RIGHT:
            case KEY_CODE_D:
                this.right = false;
                break;
            case KEY_CODE_SPACE:
                this.space = false;
                break;
            case KEY_CODE_SHIFT:
                this.shift = false;
                break;
            }
        }
    },

    on_mouse_up: function(e) {
        e = e || window.event;
        switch (e.which) {
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
    },

    on_mouse_down: function(e) {
        e = e || window.event;
        switch (e.which) {
        case this.CLICK_LEFT:
            MANAGER_WORLD.left_click_down();
            this.click_down_left = true;
            break;
        case this.CLICK_MIDDLE:
            this.click_down_middle = true;
            break;
        case this.CLICK_RIGHT:
            MANAGER_WORLD.right_click_down();
            this.click_down_right = true;
            break;
        }
    }

};