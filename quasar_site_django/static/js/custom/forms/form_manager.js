'use strict';

function FormManager(input_fields, final_button) {
    this.__init__(input_fields, final_button);
}

FormManager.prototype = {

    __init__: function(input_fields, final_button) {
        this.input_fields = [];
        this.input_fields_repeat_password = [];
        if (is_defined(input_fields)) {
            for (let f = 0; f < input_fields.length; f++) {
                this.add_input_field(input_fields[f]);
            }
        }
        if (is_defined(final_button)) {
            this.add_final_button(final_button);
        }
    },

    add_input_field: function(input_field) {
        this.input_fields.push(input_field);
        input_field.set_value_post_changed_function(this.on_input_event.bind(this));
        input_field.add_input_state();

        if (input_field.has_syntax(TEXT_SYNTAX_REPEAT_PASSWORD)) {
            this.input_fields_repeat_password.push(input_field);
        }
    },

    add_final_button: function(final_button) {
        this.final_button = final_button;
        this.final_button.add_button_state();
        this.perform_error_checks(false);
    },

    on_input_event: function() {
        this.perform_error_checks(true);
    },

    perform_error_checks: function(apply_markings) {
        //l('Performing error checks!');

        let has_errors = false;

        for (let i = 0; i < this.input_fields.length; i++) {
            let input_field = this.input_fields[i];

            let syntax;
            if (input_field.has_syntax(TEXT_SYNTAX_REPEAT_PASSWORD)) {
                syntax = input_field.syntax_check(this.input_fields_repeat_password);
            } else {
                syntax = input_field.syntax_check();
            }

            if (!syntax[0]) {
                has_errors = true;
                if (apply_markings) {
                    input_field.display_warning_icon(syntax[1]);
                }
                //l('Error was');
                //l(syntax[1]);
            } else {
                input_field.hide_warning_icon();
            }
        }

        if (has_errors) {
            this.final_button.disable();
        } else {
            this.final_button.enable();
        }

        return has_errors;
    }

};