'use strict';

const SUCCESS_MESSAGE = '';

function TextSyntax(syntax_checks) {

    this._required_syntax_rules = [];

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
        for (var r = 0; r < this._required_syntax_rules.length; r++) {
            switch(this._required_syntax_rules[r]) {
            case TEXT_SYNTAX_STANDARD_LENGTH:
                if (text.length < 4) {
                    return 'Text length is below 4.';
                } else if (text.length > 32) {
                    return 'Text length is greater than 32.';
                } else {
                    return SUCCESS_MESSAGE;
                }
            case TEXT_SYNTAX_EMAIL:
                var valid_email = is_email_valid(text);
                if (valid_email) {
                    return SUCCESS_MESSAGE;
                } else {
                    return 'Invalid email format.';
                }
            case TEXT_SYNTAX_MATCH_PASSWORDS:
                this._syntax_manager.add_password_to_match(text);
                break;
            }
        }
        return SUCCESS_MESSAGE;
    };

}

