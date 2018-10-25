'use strict';

$_QE.prototype.SyntaxRuleMaximumLength = function(maximum_length) {
    $_QE.prototype.SyntaxRule.call(this);
    this.maximum_length = maximum_length;
    this.error_message  = 'must be fewer than ' + this.maximum_length + ' characters.';
    this.check_text = function(text) {
        return text.length < this.maximum_length;
    };
};
