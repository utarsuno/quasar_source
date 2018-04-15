'use strict';

//const _WEB_SOCKET_REQUEST_KEY_CHAT_CHANNEL = 'cc';
//const _WEB_SOCKET_REQUEST_KEY_CHAT_MESSAGE = 'cm';


/*
const _WEB_SOCKET_KEY_CHAT_CHANNEL = 'cc';
const _WEB_SOCKET_KEY_CHAT_MESSAGE = 'cm';
const _WEB_SOCKET_KEY_CHAT_USER    = 'cu';
 */

function ServerRequestChatMessage() {
    this.__init__();
}

ServerRequestChatMessage.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CHAT_MESSAGE);
    },

    set_channel: function(channel) {
        this.add_key_and_value(_WEB_SOCKET_KEY_CHAT_CHANNEL, channel);
    },

    set_message: function(message) {
        this.add_key_and_value(_WEB_SOCKET_KEY_CHAT_MESSAGE, message);
    },

    _handle_response: function(success, data) {
        if (success) {
            // Do nothing for now.
        } else {
            l('Error sending chat message!');
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    }
};