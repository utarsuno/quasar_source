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

            this._initialize_mouse();
            this._initialize_keyboard();

            this.player.initialize_player_controls();
        },

        _send_world_key_event: function(key_code) {
            if (this.is_current_state(QEFLAG_STATE_RUNNING)) {
                // Don't send extra 'v' on a paste event.
                if (key_code != KEY_CODE_V || !this.key_down_control) {
                    this.manager_world.key_down_event(event);
                }
            }
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