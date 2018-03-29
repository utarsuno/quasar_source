'use strict';

function SyntaxRuleMaximumLength(maximum_length) {
    this.__init__(maximum_length);
}

SyntaxRuleMaximumLength.prototype = {
    __init__: function(maximum_length) {
        SyntaxRule.call(this);
        this.maximum_length = maximum_length;
        this.error_message  = 'must be fewer than ' + this.maximum_length + ' characters.';
    },

    check_text: function(text) {
        return text.length < this.maximum_length;
    }
};