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

            l('Checking : ' + label.get_text());
            l('Results are :');
            l(result);

            if (result) {
                label.set_background_color(COLOR_FLOATING_WALL_ERROR);
                input.set_background_color(COLOR_FLOATING_WALL_ERROR);

                // TODO : Add warning icon

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
            this._final_button.enable();
        }

    },

    add_label_and_input: function(label, input) {
        this._pairs.push([label, input]);
    },

    add_final_button: function(button) {
        this._final_button = button;
    }

};