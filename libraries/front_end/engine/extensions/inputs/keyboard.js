'use strict';

Object.assign(
    $_QE.prototype,
    {
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

            // Do block native tab events though.
            if (event.keyCode == KEY_CODE__TAB) {
                event.preventDefault();
                event.stopPropagation();
            }
        },

        _initialize_keyboard: function() {
            document.addEventListener('keydown', this.on_key_down.bind(this), true);
            document.addEventListener('keyup'  , this.on_key_up.bind(this), true);
            document.addEventListener('paste'  , this.on_paste.bind(this), true);
        },
    }
);
