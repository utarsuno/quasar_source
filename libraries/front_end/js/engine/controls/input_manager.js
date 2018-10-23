'use strict';

const IM_WHEEL_MODE_DEFAULT        = 1; // #pre-process_global_constant
const IM_WHEEL_MODE_ALTERNATIVE    = 2; // #pre-process_global_constant


$_QE.prototype.InputManager = function(engine) {
    this.engine          = engine;
    this.player          = this.engine.player;
    this.manager_world   = this.engine.manager_world;
    this._wheel_mode     = null;

    this.disable_mouse_y = false;

    this.key_down_up     = false;
    this.key_down_down   = false;
    this.key_down_left   = false;
    this.key_down_right  = false;
    this.key_down_space  = false;
    this.key_down_shift  = false;

    /*
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

     */

    this.left_click_timer = new THREE.Clock();
    this.left_click_timer.start();

    this.on_mouse_move = function(event) {
        if (this.player.has_mouse_movement()) {
            //this.player.on_mouse_move(event.movementX || event.mozMovementX || event.webkitMovementX || 0, event.movementY || event.mozMovementY || event.webkitMovementY || 0);
            if (this.disable_mouse_y) {
                this.player.on_mouse_move(event.movementX, 0);
            } else {
                this.player.on_mouse_move(event.movementX, event.movementY);
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_key_up = function(event) {
        if (this.player.has_movement()) {
            switch (event.keyCode) {
            case KEY_CODE__UP:
            case KEY_CODE_W:
                this.key_down_up = false;
                break;
            case KEY_CODE__LEFT:
            case KEY_CODE_A:
                this.key_down_left = false;
                break;
            case KEY_CODE__DOWN:
            case KEY_CODE_S:
                this.key_down_down = false;
                break;
            case KEY_CODE__RIGHT:
            case KEY_CODE_D:
                this.key_down_right = false;
                break;
            case KEY_CODE__SPACE:
                this.key_down_space = false;
                break;
            case KEY_CODE__SHIFT:
                this.key_down_shift = false;
                break;
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_mouse_up = function(event) {
        event = event || window.event;
        switch (event.which) {
        case CLICK_LEFT:
            this.manager_world.left_click_up(this.left_click_timer.getDelta() <= .3);
            break;
        case CLICK_MIDDLE:
            this.manager_world.middle_click_up();
            break;
        case CLICK_RIGHT:
            this.manager_world.right_click_up();
            break;
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_mouse_down = function(event) {
        event = event || window.event;
        switch (event.which) {
        case CLICK_LEFT:
            this.manager_world.left_click_down();
            break;
        case CLICK_MIDDLE:
            this.manager_world.middle_click_down();
            break;
        case CLICK_RIGHT:
            this.manager_world.right_click_down();
            break;
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_key_down = function(event) {
        if (this.player.has_movement()) {
            switch (event.keyCode) {
            case KEY_CODE__UP:
            case KEY_CODE_W:
                this.key_down_up = true;
                break;
            case KEY_CODE__LEFT:
            case KEY_CODE_A:
                this.key_down_left = true;
                break;
            case KEY_CODE__DOWN:
            case KEY_CODE_S:
                this.key_down_down = true;
                break;
            case KEY_CODE__RIGHT:
            case KEY_CODE_D:
                this.key_down_right = true;
                break;
            case KEY_CODE__SPACE:
                this.key_down_space = true;
                break;
            case KEY_CODE__SHIFT:
                this.key_down_shift = true;
                break;
            default:
                this.manager_world.key_down_event(event);
                break;
            }
        } else {
            this.manager_world.key_down_event(event);
        }
        event.preventDefault();
        event.stopPropagation();
    };

    // Base code modified from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
    this.on_wheel_event = function(event) {
        if (this.player.has_input()) {
            switch (this._wheel_mode) {
            case IM_WHEEL_MODE_DEFAULT:
                /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                this.engine.manager_world.on_wheel_event((event.deltaY >> 10) || 1);
                break;
            case IM_WHEEL_MODE_ALTERNATIVE:
                /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                this.engine.manager_world.on_wheel_event((-event.wheelDelta >> 10) || 1);
                break;
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_paste = function(event) {
        // Code help from : https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
        //let clipboard_data = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
        //this.manager_world.on_paste_event(clipboard_data.getData('text'));
        this.manager_world.on_paste_event((event.clipboardData || event.originalEvent.clipboardData || window.clipboardData).getData('text'));
        event.preventDefault();
        event.stopPropagation();
    };

    this.reset = function() {
        this.key_down_up 	= false;
        this.key_down_down  = false;
        this.key_down_left  = false;
        this.key_down_right = false;
        this.key_down_space = false;
        this.key_down_shift = false;
    };

    document.addEventListener('mousedown', this.on_mouse_down.bind(this), true);
    document.addEventListener('mouseup'  , this.on_mouse_up.bind(this), true);
    document.addEventListener('keydown'  , this.on_key_down.bind(this), true);
    document.addEventListener('keyup'    , this.on_key_up.bind(this), true);
    document.addEventListener('paste'    , this.on_paste.bind(this), true);
    document.addEventListener('mousemove', this.on_mouse_move.bind(this), true);

    // Base code modified from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
    if ('onwheel' in document) {
        this._wheel_mode = IM_WHEEL_MODE_DEFAULT;
        document.addEventListener('wheel', this.on_wheel_event.bind(this), true, {
            capture: true,
            passive: true
        });
    } else {
        this._wheel_mode = IM_WHEEL_MODE_ALTERNATIVE;
        document.addEventListener('mousewheel', this.on_wheel_event.bind(this), {
            capture: true,
            passive: true
        });
    }

};
