'use strict';

function TextSyntaxEmail() {
    this.__init__();
}

TextSyntaxEmail.prototype = {

    __init__: function() {
        TextSyntax.call(this, TEXT_SYNTAX_EMAIL, 'Invalid email: ');
        this.add_syntax_rule(new SyntaxRuleMinimumLength(4));
        this.add_syntax_rule(new SyntaxRuleMaximumLength(32));
    }
};
