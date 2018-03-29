'use strict';

const TEXT_SYNTAX_EMAIL    = 1;
const TEXT_SYNTAX_PASSWORD = 2;
const TEXT_SYNTAX_USERNAME = 3;

function TextSyntax(syntax_type, error_message) {
    this.text_syntax_type = syntax_type;
    this.error_message    = error_message;

    this.syntax_rules = [];

    this.add_syntax_rule = function(syntax_rule) {
        this.syntax_rules.push(syntax_rule);
    };

    this.does_text_pass_requirements = function(text) {
        for (var sr = 0; sr < this.syntax_rules.length; sr++) {
            if (!this.syntax_rules[sr].check_text(text)) {
                return [false, error_message + this.syntax_rules[sr].error_message];
            }
        }
        return [true, null];
    };
}