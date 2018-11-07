'use strict';


Object.assign(
    $_QE.prototype,
    {
        left_click_timer: new THREE.Clock(),

        key_down_up     : false,
        key_down_down   : false,
        key_down_left   : false,
        key_down_right  : false,
        key_down_space  : false,
        key_down_shift  : false,
        key_down_v      : false,
        key_down_control: false,

        _initialize_input_controls: function() {
            this.left_click_timer.start();

            document.addEventListener('mousedown', this.on_mouse_down.bind(this), true);
            document.addEventListener('mouseup'  , this.on_mouse_up.bind(this), true);
            document.addEventListener('keydown'  , this.on_key_down.bind(this), true);
            document.addEventListener('keyup'    , this.on_key_up.bind(this), true);
            document.addEventListener('paste'    , this.on_paste.bind(this), true);
            document.addEventListener('mousemove', this.on_mouse_move.bind(this), true);

            // Base code modified from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
            if ('onwheel' in document) {
                this.set_flag_on(ENGINE_BINDING_WHEEL_MODE_DEFAULT);
                document.addEventListener('wheel', this.on_wheel_event.bind(this), {
                    capture: true,
                    passive: true
                });
            } else {
                this.set_flag_off(ENGINE_BINDING_WHEEL_MODE_DEFAULT);
                document.addEventListener('mousewheel', this.on_wheel_event.bind(this), {
                    capture: true,
                    passive: true
                });
            }

            this.player.initialize_player_controls();
        },

        on_mouse_move: function(event) {
            if (this.player.has_mouse_movement()) {
                //this.player.on_mouse_move(event.movementX || event.mozMovementX || event.webkitMovementX || 0, event.movementY || event.mozMovementY || event.webkitMovementY || 0);
                if (event.movementX != 0) {
                    this.player.on_mouse_move_x(event.movementX);
                }
                if (event.movementY != 0 && !this.get_flag(ENGINE_STATE_MOUSE_Y_DISABLED)) {
                    this.player.on_mouse_move_y(event.movementY);
                }
            }
            event.preventDefault();
            event.stopPropagation();
        },

        on_key_up: function(event) {
            if (event.keyCode == KEY_CODE__CONTROL) {
                this.key_down_control = false;
            } else if (event.keyCode == KEY_CODE_V) {
                this.key_down_v = false;
            }

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
            // Don't put 'event.preventDefault()' nor 'event.stopPropagation()' here, it will prevent paste events.

            // Do block native tab events tho.
            if (event.keyCode == KEY_CODE__TAB) {
                event.preventDefault();
                event.stopPropagation();
            }
        },

        on_mouse_up: function(event) {
            //event = event || window.event;
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
        },

        on_mouse_down: function(event) {
            //event = event || window.event;
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
        },

        on_key_down: function(event) {
            if (event.keyCode == KEY_CODE__CONTROL) {
                this.key_down_control = true;
            } else if (event.keyCode == KEY_CODE_V) {
                this.key_down_v = true;
            }

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
                    this._send_world_key_event(event.keyCode);
                    break;
                }
            } else {
                this._send_world_key_event(event.keyCode);
            }
            // Don't put 'event.preventDefault()' nor 'event.stopPropagation()' here, it will prevent paste events.

            // Do block native tab events tho.
            if (event.keyCode == KEY_CODE__TAB) {
                event.preventDefault();
                event.stopPropagation();
            }
        },

        _send_world_key_event: function(key_code) {
            // Don't send extra 'v' on a paste event.
            if (key_code != KEY_CODE_V || !this.key_down_control) {
                this.manager_world.key_down_event(event);
            }
        },

        // Base code modified from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
        on_wheel_event: function(event) {
            if (this.player.has_input()) {
                if (this.get_flag(ENGINE_BINDING_WHEEL_MODE_DEFAULT)) {
                    /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                    this.manager_world.on_wheel_event((event.deltaY >> 10) || 1);
                } else {
                    /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                    this.manager_world.on_wheel_event((-event.wheelDelta >> 10) || 1);
                }
            }
            // "Unable to preventDefault inside passive event listener invocation.".
            //event.preventDefault();
            event.stopPropagation();
        },

        on_paste: function(event) {
            // Code help from : https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
            this.manager_world.on_paste_event((event.clipboardData || event.originalEvent.clipboardData || window.clipboardData).getData('text'));
            event.preventDefault();
            event.stopPropagation();
        },

        reset_inputs: function() {
            this.key_down_up 	= false;
            this.key_down_down  = false;
            this.key_down_left  = false;
            this.key_down_right = false;
            this.key_down_space = false;
            this.key_down_shift = false;
        },
    }
);


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