'use strict';

// Utility variables.
const INDEX_LABEL   = 0;
const INDEX_INPUT   = 1;
const INDEX_TOOLTIP = 2;

function TextSyntaxManager(world) {
    this.__init__(world);
}

TextSyntaxManager.prototype = {

    __init__: function(world) {
        this.world = world;

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
                    label.set_color(label.default_color, true);
                    input.set_default_background_color(COLOR_TRANSPARENT);
                    input.set_background_color(COLOR_TRANSPARENT, true);

                    input.display_all_child_attachments_with_name(ATTACHMENT_NAME_SUCCESS);
                }
            }
            if (this._final_button.is_enabled()) {
                this._final_button.disable();
            }
        }
    },

    set_error_to_pair_by_index: function(pair_index, result) {
        this._pairs[pair_index][INDEX_INPUT].set_default_background_color(COLOR_FLOATING_WALL_ERROR);
        this._pairs[pair_index][INDEX_INPUT].set_background_color(COLOR_FLOATING_WALL_ERROR, true);

        this._pairs[pair_index][INDEX_LABEL].set_color(COLOR_RED, true);

        this._pairs[pair_index][INDEX_INPUT].hide_all_child_attachments_with_name(ATTACHMENT_NAME_SUCCESS);
        this._pairs[pair_index][INDEX_INPUT].display_all_child_attachments_with_name(ATTACHMENT_NAME_WARNING);

        this._pairs[pair_index][INDEX_TOOLTIP].update_text(result);

        //.set_tool_tip(result);

        // TODO : Eventually optimize this design.
        if (this._final_button.is_enabled()) {
            this._final_button.disable();
        }
    },

    _set_all_fields_to_error_free: function() {
        for (var i = 0; i < this._pairs.length; i++) {
            var label = this._pairs[i][INDEX_LABEL];
            var input = this._pairs[i][INDEX_INPUT];

            input.display_all_child_attachments_with_name(ATTACHMENT_NAME_SUCCESS);
            input.hide_all_child_attachments_with_name(ATTACHMENT_NAME_WARNING);

            label.set_color(label.default_color, true);
            input.set_default_background_color(COLOR_TRANSPARENT);
            input.set_background_color(COLOR_TRANSPARENT, true);
        }
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
        var warning_icon = get_new_floating_icon(ICON_WARNING, this.world);
        warning_icon.set_attachment_horizontal_offset(-16, -HALF);
        warning_icon.set_attachment_depth_offset(1);
        warning_icon.set_attachment_name(ATTACHMENT_NAME_WARNING);
        warning_icon.manual_visibility = true;

        var success_icon = get_new_floating_icon(ICON_CHECKMARK, this.world);
        success_icon.set_attachment_horizontal_offset(-16, -HALF);
        success_icon.set_attachment_depth_offset(1);
        success_icon.set_attachment_name(ATTACHMENT_NAME_SUCCESS);
        success_icon.manual_visibility = true;

        input.add_attachment(warning_icon);
        input.add_attachment(success_icon);
        input.hide_all_child_attachments_with_name(ATTACHMENT_NAME_WARNING);
        input.hide_all_child_attachments_with_name(ATTACHMENT_NAME_SUCCESS);

        var tooltip = input.add_floating_2D_text(input.width * .8, null, null, 2, 'TODO : ERROR TEXT', TYPE_CONSTANT);
        tooltip.set_attachment_name(ATTACHMENT_NAME_TOOLTIP);
        tooltip.set_animation_vertical_offset(10, HALF);
        tooltip.set_animation_depth_offset(3);
        tooltip.set_animation_duration(2.25);

        input.set_look_at_function(this.input_look_at_function.bind(this, tooltip));
        input.set_look_away_function(this.input_look_away_function.bind(this, tooltip));

        this._pairs.push([label, input, tooltip]);
    },

    add_final_button: function(button) {
        this._final_button = button;

        var cross_icon = get_new_floating_icon(ICON_CROSS, this.world);
        cross_icon.set_attachment_depth_offset(1);
        cross_icon.set_attachment_name(ATTACHMENT_NAME_ERROR);
        cross_icon.manual_visibility = true;

        this._final_button.add_attachment(cross_icon);

        // Start off with the button disabled.
        this._final_button.disable();
    },

    input_look_at_function: function(tooltip) {
        tooltip._restart_animation();
        tooltip.set_to_visible();
    },

    input_look_away_function: function(tooltip) {
        tooltip.set_to_invisible();
    }

};