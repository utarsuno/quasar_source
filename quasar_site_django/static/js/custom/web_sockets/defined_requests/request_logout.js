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
        GUI_TYPING_INTERFACE.add_server_message('Sending logout request...');
    },

    _handle_response: function(success, data) {
        if (success) {
            this.success_function();
            GUI_TYPING_INTERFACE.add_server_message('logout successful!');
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    }
};
