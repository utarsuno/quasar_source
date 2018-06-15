'use strict';

function ServerRequestCreateAccount() {
    this.__init__();
}

ServerRequestCreateAccount.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT);
    },

    _perform_request: function() {
        CURRENT_CLIENT.add_server_message_green('Sending create account request...');
    },

    _handle_response: function(success, data) {
        if (success) {
            CURRENT_CLIENT.add_server_message_green('Account created!');
            this.unlock_button();
            this.success_function();
        } else {
            this.unlock_button();
            CURRENT_CLIENT.add_server_message_red('Error: {' + data + '}');
        }
    }
};