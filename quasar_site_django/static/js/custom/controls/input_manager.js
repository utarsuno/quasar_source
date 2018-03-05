'use strict';

const CLICK_LEFT   = 1;
const CLICK_MIDDLE = 2;
const CLICK_RIGHT  = 3;

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

        this._left_click_buffer = [];

        /* The flag that determines whether the wheel event is supported. */
        this.supports_wheel = false;
    },

    // TODO : CREATE AN INPUT RESET METHOD!!!
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
        this._left_click_buffer.length = 0;
    },

    on_paste: function(e) {
        if (CURRENT_PLAYER.has_paste_event()) {
            // Code help from : https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
            var clipboard_data = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
            var pasted_data = clipboard_data.getData('text');
            MANAGER_WORLD.current_world.currently_looked_at_object.parse_text(pasted_data);
        }
    },

    on_mouse_move: function(event) {
        if (CURRENT_PLAYER.has_mouse_movement()) {
            var movement_x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movement_y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            CURRENT_PLAYER.fps_controls.on_mouse_move(movement_x, movement_y);

            // TODO : Not currently used for now.
            /*
            // Only left click dragging will be supported for now.
            if (this.click_down_left) {
                MANAGER_WORLD.current_world.parse_mouse_drag(movement_x, movement_y);
            } else {
                MANAGER_WORLD.current_world.parse_mouse_movement(movement_x, movement_y);
            }
            */
        }
    },

    on_key_down: function(event) {
        if (CURRENT_PLAYER.in_typing_state()) {
            l('CURRENT PLAYER is in typing state.');
            if (event.keyCode === KEY_CODE_ENTER) {
                l('NEED TO EXIT TYPING STATE!');
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

        if (CURRENT_PLAYER.has_input()) {
            switch (e.which) {
            case CLICK_LEFT:
                this.click_down_left = false;

                if (MANAGER_WORLD.current_world.floating_cursor._currently_engaged) {
                    MANAGER_WORLD.current_world.floating_cursor.disengage();
                } else if (this._left_click_buffer.length === 1) {
                    MANAGER_WORLD.current_world.single_left_click();
                } else if (this._left_click_buffer.length !== 0) {
                    MANAGER_WORLD.current_world.multi_left_click();
                }

                break;
            case CLICK_MIDDLE:

                if (MANAGER_POINTER_LOCK.pointer_is_locked) {
                    MANAGER_POINTER_LOCK.release_pointer_lock();
                } else {
                    MANAGER_POINTER_LOCK.request_pointer_lock();
                }

                //MANAGER_WORLD.current_world.single_middle_click();
                this.click_down_middle = false;
                break;
            case CLICK_RIGHT:
                if (MANAGER_WORLD.current_player_menu.is_visible()) {
                    MANAGER_WORLD.current_player_menu.set_to_invisible();
                } else {
                    MANAGER_WORLD.current_world.single_right_click();
                }
                this.click_down_right = false;
                break;
            }
        } else if (e.which === CLICK_LEFT && CURRENT_PLAYER.is_paused() && this._left_click_buffer.length > 1) {
            CURRENT_PLAYER.set_state(PLAYER_STATE_FULL_CONTROL);
        }
    },

    // Code base from : https://stackoverflow.com/questions/9521519/how-can-i-detect-a-rightmouse-button-event-on-mousedown
    on_mouse_down: function(e) {
        e = e || window.event;
        switch (e.which) {
        case CLICK_LEFT:

            var current_milliseconds = new Date().getTime();

            for (var i = this._left_click_buffer.length; i--;) {
                if (current_milliseconds - this._left_click_buffer[i] >= 300) {
                    this._left_click_buffer.splice(i, 1);
                }
            }

            this._left_click_buffer.push(current_milliseconds);

            if (CURRENT_PLAYER.has_input()) {
                // Cursor engage.
                if (is_defined(MANAGER_WORLD.current_world.floating_cursor.currently_attached_to)) {
                    if (MANAGER_WORLD.current_world.floating_cursor.currently_attached_to.scalable) {
                        MANAGER_WORLD.current_world.floating_cursor.engage();
                    }
                }
            }

            this.click_down_left = true;
            break;
        case CLICK_MIDDLE:
            this.click_down_middle = true;
            break;
        case CLICK_RIGHT:
            if (CURRENT_PLAYER.has_input()) {
                if (!this.click_down_right) {

                    // If the player has input and is NOT engaged AND the player menu is not visible then right clicking will make the PlayerMenu show up.

                    var currently_looked_at_object = CURRENT_PLAYER.get_currently_looked_at_object();
                    if (is_defined(currently_looked_at_object)) {
                        if (!currently_looked_at_object.is_engaged()) {
                            if (!MANAGER_WORLD.current_player_menu.is_visible()) {
                                MANAGER_WORLD.current_player_menu.set_to_visible();
                            }
                        } else {
                            currently_looked_at_object.disengage();
                        }
                    } else {
                        if (!MANAGER_WORLD.current_player_menu.is_visible()) {
                            MANAGER_WORLD.current_player_menu.set_to_visible();
                        }
                    }
                }
            }
            this.click_down_right = true;
            break;
        }
    }

};