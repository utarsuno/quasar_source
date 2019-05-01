'use strict';

Object.assign( $_QE.prototype, {

    /**
     * @reference: https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
     * @param event
     */
    on_paste: function(event) {
        let data = (event.clipboardData || event.originalEvent.clipboardData || window.clipboardData).getData('text');

        if (this.player.in_hud_typing_state()) {
            this.engine.hud_typing.on_paste_event(data);
        } else if (this.player.has_input() && this.player.get_currently_looked_at() !== null) {
            this.player.get_currently_looked_at().on_paste_event(data);
        }
        event.preventDefault();
        return false;
    },

    reset_inputs: function() {
        this.key_down_up 	= false;
        this.key_down_down  = false;
        this.key_down_left  = false;
        this.key_down_right = false;
        this.key_down_space = false;
        this.key_down_shift = false;
    },

    on_key_up: function(event) {
        if (event.keyCode === KEY_CODE__CONTROL) {
            this.key_down_control = false;
        } else if (event.keyCode === KEY_CODE_V) {
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
        if (event.keyCode === KEY_CODE__TAB) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    on_key_down: function(event) {
        let key_code = event.keyCode;

        if (key_code === KEY_CODE__CONTROL) {
            this.key_down_control = true;
        } else if (key_code === KEY_CODE_V) {
            this.key_down_v = true;
        }

        let send_key_event_to_world = false;

        if (this.player.has_movement()) {
            switch (key_code) {
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
                send_key_event_to_world = true;
                this._send_world_key_event(key_code);
                break;
            }
        } else {
            send_key_event_to_world = true;
            this._send_world_key_event(key_code);
        }
        // Don't put 'event.preventDefault()' nor 'event.stopPropagation()' here, it will prevent paste events.

        // Don't send extra 'v' on a paste event.
        if (send_key_event_to_world && this.is_current_state(QEFLAG_STATE_RUNNING) && (key_code !== KEY_CODE_V || !this.key_down_control)) {
            this.manager_world.key_down_event(event);
        }

        // Do block native tab events though.
        if (event.keyCode === KEY_CODE__TAB) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

});
