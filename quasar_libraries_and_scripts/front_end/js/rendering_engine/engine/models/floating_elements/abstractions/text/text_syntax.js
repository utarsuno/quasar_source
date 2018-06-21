'use strict';

const TEXT_SYNTAX_EMAIL           = 1; // #pre-process_global_constant
const TEXT_SYNTAX_PASSWORD        = 2; // #pre-process_global_constant
const TEXT_SYNTAX_REPEAT_PASSWORD = 3; // #pre-process_global_constant
const TEXT_SYNTAX_USERNAME        = 4; // #pre-process_global_constant

$_QE.prototype.TextSyntax = function(syntax_type, error_message) {
    this.text_syntax_type = syntax_type;
    this.error_message    = error_message;

    this.syntax_rules = [];

    this.add_syntax_rule = function(syntax_rule) {
        this.syntax_rules.push(syntax_rule);
    };

    this.does_text_pass_requirements = function(text, additional_arguments) {
        for (let sr = 0; sr < this.syntax_rules.length; sr++) {
            if (!this.syntax_rules[sr].check_text(text)) {
                return [false, error_message + this.syntax_rules[sr].error_message];
            }
        }

        // For repeat password.
        if (this.text_syntax_type === TEXT_SYNTAX_REPEAT_PASSWORD) {
            let all_matching = true;
            for (let i = 0; i < additional_arguments.length; i++) {
                if (additional_arguments[i].text !== text) {
                    return [false, 'passwords do not match.'];
                }
            }
        }

        return [true, null];
    };
};
