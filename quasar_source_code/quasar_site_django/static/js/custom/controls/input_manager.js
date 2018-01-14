'use strict';

const CLICK_LEFT   = 1;
const CLICK_MIDDLE = 2;
const CLICK_RIGHT  = 3;

const EVENT_MOUSE_DOWN = 'mousedown';
const EVENT_MOUSE_UP   = 'mouseup';
const EVENT_KEY_DOWN   = 'keydown';
const EVENT_KEY_UP     = 'keyup';
const EVENT_PASTE      = 'paste';
const EVENT_WHEEL_V0   = 'wheel';
const EVENT_WHEEL_V1   = 'mousewheel';
const EVENT_WHEEL_V2   = 'DOMMouseScroll';

function InputManager() {
    this.__init__();
}

InputManager.prototype = {
    // Used by multiple references.
    click_down_left   : null,
    click_down_right  : null,
    click_down_middle : null,
    // Used by fps_controls.
    up    			  : null,
    down  		      : null,
    left  			  : null,
    right 			  : null,
    space             : null,
    shift   		  : null,

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

        // Cross browser support for wheel events.
        // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript

        // TODO : Double check to only add one of them and not all 3 if all 3 are supported.
        document.addEventListener(EVENT_WHEEL_V0  , this.on_wheel_event.bind(this));
        document.addEventListener(EVENT_WHEEL_V1  , this.on_wheel_event.bind(this));
        document.addEventListener(EVENT_WHEEL_V2  , this.on_wheel_event.bind(this));

        this._key_down_buffer = [];

        /* The flag that determines whether the wheel event is supported. */
        this.supports_wheel = false;
    },

    on_paste: function(e) {
        // Code help from : https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
        var clipboard_data = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
        var pasted_data = clipboard_data.getData('text');
        if (is_defined(MANAGER_WORLD.current_world.currently_looked_at_object)) {
            if (CURRENT_PLAYER.is_engaged()) {
                MANAGER_WORLD.current_world.currently_looked_at_object.parse_text(pasted_data);
            }
        }
    },

    on_key_down: function(event) {
        switch(event.keyCode) {
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
        case KEY_CODE_ENTER:
            if (GUI_TYPING_INTERFACE.is_visible()) {
                GUI_TYPING_INTERFACE.add_user_text();
                GUI_TYPING_INTERFACE.hide();
                CURRENT_PLAYER.disengage();
                CURRENT_PLAYER.fps_controls.enable();
            } else if (!CURRENT_PLAYER.is_engaged()) {
                if (!is_defined(MANAGER_WORLD.current_world.currently_looked_at_object)) {
                    if (!GUI_TYPING_INTERFACE.is_visible()) {
                        GUI_TYPING_INTERFACE.show();
                        CURRENT_PLAYER.engage();
                    }
                }
            }
            break;
        }

        // Check who should currently process events.
        if (GUI_TYPING_INTERFACE.is_visible()) {
            GUI_TYPING_INTERFACE.key_down_event(event);
        } else {
            MANAGER_WORLD.key_down_event(event);
        }
    },

    // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
    on_wheel_event: function(e) {
        /* Check whether the wheel event is supported. */
        if (e.type =='"wheel') this.supports_wheel = true;
        else if (this.supports_wheel) return;

        /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
        var delta = ((e.deltaY || -e.wheelDelta || e.detail) >> 10) || 1;
        
        /* ... */
        MANAGER_WORLD.current_world.wheel_event(delta);
    },

    on_key_up: function(event) {
        switch(event.keyCode) {
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
    },

    on_mouse_up: function(e) {
        e = e || window.event;
        switch (e.which) {
        case CLICK_LEFT:
            this.click_down_left = false;
            if (this._key_down_buffer.length === 1) {
                MANAGER_WORLD.current_world.single_left_click();
            } else if (this._key_down_buffer.length !== 0) {
                MANAGER_WORLD.current_world.multi_left_click();
            }
            break;
        case CLICK_MIDDLE:
            MANAGER_WORLD.current_world.single_middle_click();
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
    },

    // Code base from : https://stackoverflow.com/questions/9521519/how-can-i-detect-a-rightmouse-button-event-on-mousedown
    on_mouse_down: function(e) {
        e = e || window.event;
        switch (e.which) {
        case CLICK_LEFT:

            var current_milliseconds = new Date().getTime();

            for (var i = this._key_down_buffer.length; i--;) {
                if (current_milliseconds - this._key_down_buffer[i] >= 300) {
                    this._key_down_buffer.splice(i, 1);
                }
            }

            this._key_down_buffer.push(current_milliseconds);

            if (is_defined(MANAGER_WORLD.current_world.currently_looked_at_object)) {
                if (!MANAGER_WORLD.current_world.currently_looked_at_object.is_engaged()) {
                    if (MANAGER_WORLD.current_floating_cursor.is_currently_visible()) {
                        MANAGER_WORLD.current_floating_cursor.engage();
                    }
                }
            } else {
                if (MANAGER_WORLD.current_floating_cursor.is_currently_visible()) {
                    MANAGER_WORLD.current_floating_cursor.engage();
                }
            }

            this.click_down_left = true;
            break;
        case CLICK_MIDDLE:
            this.click_down_middle = true;
            MANAGER_INPUT.click_down_middle = true;
            break;
        case CLICK_RIGHT:
            if (!this.click_down_right) {
                // The player menu will only get set to visible if the correct conditions are present.
                if (!GUI_PAUSED_MENU.is_visible()) {
                    if (!MANAGER_WORLD.current_player_menu.is_visible()) {
                        MANAGER_WORLD.current_player_menu.set_to_visible();
                    }
                }
            }
            this.click_down_right = true;
            break;
        }
    }

};