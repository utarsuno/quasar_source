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
            // On success <result> will be ''. (If ('') returns false).
            if (result) {
                var label = this._pairs[i][INDEX_LABEL];
                label.set_background_color(COLOR_FLOATING_WALL_ERROR);
                errors.push([label.get_text(), result]);
            } else {
                label.set_background_color(COLOR_TRANSPARENT);
            }
        }

        /*
        if (errors.length > 0) {

        } else {
            this._final_button
        }
        */
    },

    add_label_and_input: function(label, input) {
        this._pairs.push([label, input]);
    },

    add_final_button: function(button) {
        this._final_button = button;
    }

};