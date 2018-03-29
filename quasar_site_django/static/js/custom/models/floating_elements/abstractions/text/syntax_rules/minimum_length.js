'use strict';

function SyntaxRuleMinimumLength(minimum_length) {
    this.__init__(minimum_length);
}

SyntaxRuleMinimumLength.prototype = {
    __init__: function(minimum_length) {
        SyntaxRule.call(this);
        this.minimum_length = minimum_length;
        this.error_message  = 'must be greater than ' + this.minimum_length + ' characters.';
    },

    check_text: function(text) {
        return text.length <= this.minimum_length;
    }
};