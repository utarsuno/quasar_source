'use strict';

function ServerRequestLogout() {
    this.__init__();
}

ServerRequestLogout.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGOUT);
    },

    _perform_request: function() {
        CURRENT_CLIENT.add_server_message_green('Sending logout request...');
    },

    _handle_response: function(success, data) {
        if (success) {
            this.success_function();
            CURRENT_CLIENT.add_server_message_green('logout successful!');
        } else {
            CURRENT_CLIENT.add_server_message_red('Error: {' + data + '}');
        }
    }
};
