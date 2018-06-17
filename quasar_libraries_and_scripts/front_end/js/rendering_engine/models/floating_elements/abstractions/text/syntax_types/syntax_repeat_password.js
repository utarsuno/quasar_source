'use strict';

function TextSyntaxRepeatPassword() {
    this.__init__();
}

TextSyntaxRepeatPassword.prototype = {

    __init__: function() {
        TextSyntax.call(this, TEXT_SYNTAX_REPEAT_PASSWORD, 'Invalid password: ');
        this.add_syntax_rule(new SyntaxRuleMinimumLength(4));
        this.add_syntax_rule(new SyntaxRuleMaximumLength(32));
    }
};
