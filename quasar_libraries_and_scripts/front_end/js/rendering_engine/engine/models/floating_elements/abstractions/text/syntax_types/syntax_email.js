'use strict';

$_QE.prototype.TextSyntaxEmail = function() {
    $_QE.prototype.TextSyntax.call(this, TEXT_SYNTAX_EMAIL, 'Invalid email: ');
    this.add_syntax_rule(new $_QE.prototype.SyntaxRuleEmail());
};
