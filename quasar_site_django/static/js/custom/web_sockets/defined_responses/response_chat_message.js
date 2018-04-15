'use strict';

// For chat messages.
const _WEB_SOCKET_REQUEST_KEY_CHAT_CHANNEL = 'cc';
const _WEB_SOCKET_REQUEST_KEY_CHAT_MESSAGE = 'cm';
const _WEB_SOCKET_REQUEST_KEY_CHAT_USER    = 'cu';

/*
const _WEB_SOCKET_KEY_CHAT_CHANNEL = 'cc';
const _WEB_SOCKET_KEY_CHAT_MESSAGE = 'cm';
const _WEB_SOCKET_KEY_CHAT_USER    = 'cu';
 */

function ServerMessageChatMessage() {
    this.__init__();
}

ServerMessageChatMessage.prototype = {

    __init__: function() {
        // Inherit.
        ServerMessage.call(this, _WEB_SOCKET_RESPONSE_VALUE_MESSAGE_TYPE_CHAT_MESSAGE);
    },

    handle_message: function(response) {
        var message_channel  = response[_WEB_SOCKET_REQUEST_KEY_CHAT_CHANNEL];
        var message_contents = response[_WEB_SOCKET_REQUEST_KEY_CHAT_MESSAGE];
        var message_user     = response[_WEB_SOCKET_REQUEST_KEY_CHAT_USER];

        l('TODO HANDLE THE SERVER CHAT RESPONSE!!');
        l(message_channel);
        l(message_contents);
        l(message_user);

        // TODO : Change design of this part later.
        var current_user = ENTITY_OWNER.get_username();

        if (current_user !== message_user) {
            MANAGER_WEB_SOCKETS.display_received_chat_message(message_user, message_contents, message_channel)
        }

    }

};