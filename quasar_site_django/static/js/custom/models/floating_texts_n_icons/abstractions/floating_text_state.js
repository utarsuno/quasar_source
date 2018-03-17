'use strict';

const TEXT_STATE_DEFAULT    = 1;
const TEXT_STATE_ERROR      = 2;
const TEXT_STATE_DISABLED   = 3;
const TEXT_STATE_HOVER_OVER = 4;
const TEXT_STATE_ACTIVE     = 5;

function TextState(text_state, original_foreground_color, original_background_color) {
    this.__init__(text_state);
}

TextState.prototype = {

    __init__: function(text_state, original_foreground_color, original_background_color) {
        this.current_state = text_state;
        this.original_foreground_color = original_foreground_color;
        this.original_background_color = original_background_color;
        this.original_background_color_is_transparent = original_background_color === COLOR_TRANSPARENT;

        this.previous_foreground_color = null;
        this.previous_background_color = null;

        this.current_foreground_color = this.original_foreground_color;
        this.current_background_color = this.original_background_color;
    },

    set_state: function(new_state) {



        // this.original_background_color_is_transparent =
        // this.original_background_color_is_transparent =
        // this.original_background_color_is_transparent =
    }

};