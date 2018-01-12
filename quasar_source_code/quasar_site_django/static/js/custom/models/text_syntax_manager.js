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

        this._passwords_to_match = [];
    },

    error_check: function() {
        var error = false;
        var result = null;

        var bad_indexes = [];

        // First check the standard syntax rules.
        for (var i = 0; i < this._pairs.length; i++) {
            this._pairs[i][INDEX_INPUT].set_syntax_manager(this);

            result = this._pairs[i][INDEX_INPUT].syntax_check();

            if (result !== '') {
                bad_indexes.push(i);
                error = true;
                this.set_error_to_pair_by_index(i, result);
                //break;
            }
        }

        // Now check for any non-matched passwords.
        if (!error) {

            var passwords_matched = true;

            for (i = 0; i < this._pairs.length; i++) {
                if (this._pairs[i][INDEX_INPUT].has_syntax_rule(TEXT_SYNTAX_MATCH_PASSWORDS)) {
                    if (!this._matches_all_passwords_to_match(this._pairs[i][INDEX_INPUT].get_text())) {
                        passwords_matched = false;
                        error = true;
                        break;
                    }
                }
            }

            if (!passwords_matched) {
                for (i = 0; i < this._pairs.length; i++) {
                    if (this._pairs[i][INDEX_INPUT].has_syntax_rule(TEXT_SYNTAX_MATCH_PASSWORDS)) {
                        bad_indexes.push(i);
                        this.set_error_to_pair_by_index(i, 'Not all passwords match!');
                    }
                }
            }
        }

        if (!error) {
            this._set_all_fields_to_error_free();
            // TODO : Remove warning icon

        } else {
            for (i = 0; i < this._pairs.length; i++) {
                if (bad_indexes.indexOf(i) === NOT_FOUND) {
                    var label = this._pairs[i][INDEX_LABEL];
                    var input = this._pairs[i][INDEX_INPUT];
                    label.set_color(COLOR_TRANSPARENT, true);
                    input.set_default_background_color(COLOR_TRANSPARENT, true);
                }
            }
            this._final_button.disable();
        }
    },

    set_error_to_pair_by_index: function(pair_index, result) {
        this._pairs[pair_index][INDEX_INPUT].set_default_background_color(COLOR_FLOATING_WALL_ERROR);
        this._pairs[pair_index][INDEX_INPUT].set_background_color(COLOR_FLOATING_WALL_ERROR, true);

        this._pairs[pair_index][INDEX_LABEL].set_color(COLOR_RED, true);
        // TODO : Add warning icon
        this._pairs[pair_index][INDEX_INPUT].display_icon_to_the_right(ICON_WARNING);
        this._pairs[pair_index][INDEX_INPUT].set_tool_tip(result);

        // TODO : Eventually optimize this design.
        this._final_button.disable();
    },

    _set_all_fields_to_error_free: function() {
        for (var i = 0; i < this._pairs.length; i++) {
            var label = this._pairs[i][INDEX_LABEL];
            var input = this._pairs[i][INDEX_INPUT];
            label.set_color(this.default_color, true);
            input.set_default_background_color(COLOR_TRANSPARENT);
            input.set_background_color(COLOR_TRANSPARENT, true);
        }
        l('TODO : Enable the final button!');
        this._final_button.enable();
    },

    _matches_all_passwords_to_match: function(text) {
        for (var p = 0; p < this._passwords_to_match; p++) {
            if (this._passwords_to_match !== text) {
                return false;
            }
        }
        return true;
    },

    add_password_to_match: function(p) {
        this._passwords_to_match.push(p);
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