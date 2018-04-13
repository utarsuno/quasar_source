'use strict';

function ServerRequestSaveData() {
    this.__init__();
}

ServerRequestSaveData.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_SAVE_DATA);
    },

    _perform_request: function() {
        GUI_TYPING_INTERFACE.add_server_message('Sending save request...');
    },

    _handle_response: function(success, data) {
        if (success) {
            GUI_TYPING_INTERFACE.add_server_message('data saved!');
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    }
};