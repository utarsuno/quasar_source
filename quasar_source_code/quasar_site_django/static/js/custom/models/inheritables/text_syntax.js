'use strict';

const SUCCESS_MESSAGE = '';

function TextSyntax(syntax_checks) {

    this._required_syntax_rules = [];
    this._has_syntax_error = null;
    this._syntax_error_message = null;

    for (var sc = 0; sc < syntax_checks.length; sc++) {
        this._required_syntax_rules.push(syntax_checks[sc]);
    }

    this.has_syntax_rule = function(sr) {
        for (var r = 0; r < this._required_syntax_rules; r++) {
            if (this._required_syntax_rules[r] === sr) {
                return true;
            }
        }
        return false;
    };

    this.set_syntax_manager = function(sm) {
        this._syntax_manager = sm;
    };

    this.syntax_check = function() {
        var text = this.get_text();



        this._has_syntax_error = false;
        for (var r = 0; r < this._required_syntax_rules.length; r++) {
            switch(this._required_syntax_rules[r]) {
            case TEXT_SYNTAX_STANDARD_LENGTH:
                if (text.length < 4) {
                    this._set_syntax_error('Text length is below 4.');
                } else if (text.length > 32) {
                    this._set_syntax_error('Text length is greater than 32.');
                }
                break;
            case TEXT_SYNTAX_EMAIL:
                var valid_email = is_email_valid(text);
                if (!valid_email) {
                    this._set_syntax_error('Invalid email format.');
                }
                break;
            case TEXT_SYNTAX_MATCH_PASSWORDS:
                if (!this._syntax_manager.matches_required_passwords(text)) {
                    this._set_syntax_error('Passwords do not match!');
                }
                break;
            }
        }
    };

    this._set_syntax_error = function(error_message) {
        this._has_syntax_error = true;
        this._syntax_error_message = error_message;
    };

}

