'use strict';

$_QE.prototype.FeatureSyntax = function() {

    this.syntax_rules = [];

    this._is_password = false;

    /*__           ___              __   __   ___  __       ___    __        __
     /__` \ / |\ |  |   /\  \_/    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     .__/  |  | \|  |  /~~\ / \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.add_syntax = function(text_syntax) {
        switch (text_syntax) {
        case TEXT_SYNTAX_PASSWORD:
            this._is_password = true;
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxPassword());
            break;
        case TEXT_SYNTAX_USERNAME:
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxUsername());
            break;
        case TEXT_SYNTAX_EMAIL:
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxEmail());
            break;
        case TEXT_SYNTAX_REPEAT_PASSWORD:
            this._is_password = true;
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxRepeatPassword());
            break;
        }
    };

    this.has_syntax = function(syntax) {
        for (let sr = 0; sr < this.syntax_rules.length; sr++) {
            if (this.syntax_rules[sr].text_syntax_type === syntax) {
                return true;
            }
        }
        return false;
    };

    this.syntax_check = function(additional_arguments) {
        for (let sr = 0; sr < this.syntax_rules.length; sr++) {

            let results = this.syntax_rules[sr].does_text_pass_requirements(this.text, additional_arguments);

            if (!results[0]) {
                return [false, results[1]];
            }
        }
        return [true, null];
    };
};