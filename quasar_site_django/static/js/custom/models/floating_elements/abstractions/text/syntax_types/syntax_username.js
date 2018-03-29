'use strict';

function TextSyntaxUsername() {
    this.__init__();
}

TextSyntaxUsername.prototype = {

    __init__: function() {
        TextSyntax.call(this, TEXT_SYNTAX_PASSWORD, 'Invalid username: ');
        this.add_syntax_rule(new SyntaxRuleMinimumLength(4));
        this.add_syntax_rule(new SyntaxRuleMaximumLength(32));
    }
};
