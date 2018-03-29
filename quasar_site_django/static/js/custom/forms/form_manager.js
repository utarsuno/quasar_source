'use strict';

function FormManager() {
    this.__init__();
}

FormManager.prototype = {

    __init__: function() {
        this.input_fields = [];
        this.final_button = null;
    },

    add_input_field: function(input_field) {
        this.input_fields.push(input_field);
        input_field.set_value_post_changed_function(this.on_input_event.bind(this));
        input_field.add_input_state();
    },

    add_final_button: function(final_button) {
        this.final_button = final_button;
        this.final_button.add_button_state();
        this.perform_error_checks(false);
    },

    on_input_event: function() {
        this.perform_error_checks(false);
    },

    perform_error_checks: function(apply_markings) {
        l('Performing error checks!');

        var has_errors = false;

        for (var i = 0; i < this.input_fields.length; i++) {
            var input_field = this.input_fields[i];
            var syntax = input_field.syntax_check();
            if (!syntax[0]) {
                has_errors = true;
                if (apply_markings) {
                    input_field.display_warning_icon();
                }
                l('Error was');
                l(syntax[1]);
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