'use strict';

// Utility variables.
const INDEX_LABEL = 0;
const INDEX_INPUT = 1;

function TextSyntaxManager() {
    this.__init__();
}

TextSyntaxManager.prototype = {

    __init__: function() {
        this._pairs = [];
        this._final_button = null;
    },

    error_check: function() {

        // TODO : outline the steps to be taken (!!! -> remove as much as possible from LoginWorld as possible <- !!!)

        var errors = [];
        for (var i = 0; i < this._pairs.length; i++) {
            var result = this._pairs[i][INDEX_INPUT].syntax_check();
            var label = this._pairs[i][INDEX_LABEL];
            var input = this._pairs[i][INDEX_INPUT];
            // On success <result> will be ''. (If ('') returns false).
            if (result) {
                label.set_background_color(COLOR_FLOATING_WALL_ERROR);
                input.set_background_color(COLOR_FLOATING_WALL_ERROR);

                // TODO : Add warning icon
                input.display_icon_to_the_right(ICON_WARNING);

                errors.push([label.get_text(), result]);
            } else {
                label.set_background_color(COLOR_TRANSPARENT);
                input.set_background_color(COLOR_TRANSPARENT);

                // TODO : Remove warning icon
            }
        }

        if (errors.length > 0) {
            this._final_button.disable();
        } else {
            l('Trying to enable the button!');
            this._final_button.enable();
        }
    },

    add_label_and_input: function(label, input) {
        this._pairs.push([label, input]);
    },

    add_final_button: function(button) {
        this._final_button = button;
        // Start off with the button disabled.
        this._final_button.disable();
    }

};