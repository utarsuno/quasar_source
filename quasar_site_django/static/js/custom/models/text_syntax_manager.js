'use strict';

// Utility variables.
const INDEX_LABEL     = 0;
const INDEX_INPUT     = 1;
const INDEX_TOOLTIP   = 2;

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
        var no_errors = true;

        for (var p = 0; p < this._pairs.length; p++) {
            var label = this._pairs[p][INDEX_LABEL];
            var input = this._pairs[p][INDEX_INPUT];
            var tooltip = this._pairs[p][INDEX_TOOLTIP];

            input.syntax_check();

            if (input._has_syntax_error) {

                no_errors = false;

                input.set_default_background_color(COLOR_FLOATING_WALL_ERROR);
                input.set_background_color(COLOR_FLOATING_WALL_ERROR, true);
                input.hide_all_child_attachments_with_name(ATTACHMENT_NAME_SUCCESS);
                input.display_all_child_attachments_with_name(ATTACHMENT_NAME_WARNING);

                label.set_color(COLOR_RED, true);

                tooltip.update_text(input._syntax_error_message);

                if (this._final_button.is_enabled()) {
                    this._final_button.disable();
                }
            } else {

                input.set_default_background_color(COLOR_TRANSPARENT);
                input.set_background_color(COLOR_TRANSPARENT, true);
                input.display_all_child_attachments_with_name(ATTACHMENT_NAME_SUCCESS);
                input.hide_all_child_attachments_with_name(ATTACHMENT_NAME_WARNING);

                label.set_color(label.default_color, true);

                tooltip.end_animation();
                tooltip.set_to_invisible();
            }
        }

        if (no_errors) {
            this._final_button.enable();
        }
    },

    matches_required_passwords: function(text) {
        for (var p = 0; p < this._passwords_to_match.length; p++) {
            if (text !== this._passwords_to_match[p].get_text()) {
                return false;
            }
        }
        return true;
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

        var tooltip = input.add_floating_2D_text(input.width * 1, null, null, 2, 'should not be visible', TYPE_CONSTANT);
        tooltip.set_attachment_name(ATTACHMENT_NAME_TOOLTIP);
        tooltip.set_animation_vertical_offset(20, HALF);
        tooltip.set_animation_depth_offset(4);
        tooltip.set_animation_duration(.25);
        tooltip.set_to_invisible();

        input.set_look_at_function(this.input_look_at_function.bind(this, input, tooltip));
        input.set_look_away_function(this.input_look_away_function.bind(this, tooltip));

        if (input.has_syntax_rule(TEXT_SYNTAX_MATCH_PASSWORDS)) {
            this._passwords_to_match.push(input);
        }

        input.set_syntax_manager(this);

        this._pairs.push([label, input, tooltip, false]);
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

    input_look_at_function: function(input, tooltip) {
        if (input._has_syntax_error) {
            tooltip._restart_animation();
            tooltip.set_to_visible();
        }
    },

    input_look_away_function: function(tooltip) {
        tooltip.set_to_invisible();
    }

};