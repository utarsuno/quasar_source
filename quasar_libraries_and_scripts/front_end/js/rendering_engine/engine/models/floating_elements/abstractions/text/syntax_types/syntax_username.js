'use strict';

$_QE.prototype.TextSyntaxUsername = function() {
    $_QE.prototype.TextSyntax.call(this, TEXT_SYNTAX_USERNAME, 'Invalid username: ');
    this.add_syntax_rule(new $_QE.prototype.SyntaxRuleMinimumLength(4));
    this.add_syntax_rule(new $_QE.prototype.SyntaxRuleMaximumLength(32));
};
