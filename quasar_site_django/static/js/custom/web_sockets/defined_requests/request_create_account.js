'use strict';

function ServerRequestCreateAccount() {
    this.__init__();
}

ServerRequestCreateAccount.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT);
    },

    set_username: function(username) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_USERNAME, username);
    },

    set_password: function(password) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_PASSWORD, password);
    },

    set_email: function(email) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_EMAIL, email);
    },

    _perform_request: function() {
        GUI_TYPING_INTERFACE.add_server_message('Sending create account request...');
    },

    _handle_response: function(success, data) {
        if (success) {
            GUI_TYPING_INTERFACE.add_server_message('Account created!');
            this.unlock_button();
            // TODO : Login!!!
        } else {
            this.unlock_button();
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    }
};