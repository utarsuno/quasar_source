'use strict';

$_QE.prototype.SyntaxRuleEmail = function() {
    $_QE.prototype.SyntaxRule.call(this);
    this.error_message  = 'invalid email format.';

    this.check_text = function(text) {
        // Base code from : https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(text);
    };
};