'use strict';

$_QE.prototype.SyntaxRuleMinimumLength = function(minimum_length) {
    $_QE.prototype.SyntaxRule.call(this);
    this.minimum_length = minimum_length;
    this.error_message  = 'must be greater than ' + this.minimum_length + ' characters.';
    this.check_text = function(text) {
        return text.length >= this.minimum_length;
    };
};