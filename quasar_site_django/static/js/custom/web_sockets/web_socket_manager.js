'use strict';

// Server response keys.
const _WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID   = 'm';
const _WEB_SOCKET_RESPONSE_KEY_SUCCESS      = 's';
const _WEB_SOCKET_RESPONSE_KEY_DATA         = 'd';
// For server messages.
const _WEB_SOCKET_RESPONSE_KEY_MESSAGE_TYPE = 't';

// Server response values.
const _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE  = 0;
const _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_FALSE = 1;



const _WEB_SOCKET_KEY_CHAT_CHANNEL = 'cc';
const _WEB_SOCKET_KEY_CHAT_MESSAGE = 'cm';
const _WEB_SOCKET_KEY_CHAT_USER    = 'cu';


// Server message types.
const _WEB_SOCKET_RESPONSE_VALUE_MESSAGE_TYPE_CHAT_MESSAGE = 1;

function WebSocketManager() {
    this.__init__();
}

WebSocketManager.prototype = {

    __init__: function() {
        this._connection_string = 'ws://' + window.location.host + '/ws/';
        this._messages_in_limbo = {};
        this._message_id = 0;

        // All the various server message types.
        this._server_message_chat_message = new ServerMessageChatMessage();

        // Inherit.
        ChatManager.call(this);
    },

    send_message: function(message) {
        message.set_message_id(this._message_id);
        this._messages_in_limbo[this._message_id] = message;
        this._message_id += 1;
        this.socket.send(message.get_message());
    },

    _message_received: function(message) {
        var response = JSON.parse(message.data).text;

        // TODO : Check if the message is a response or a server message.
        if (_WEB_SOCKET_RESPONSE_KEY_SUCCESS in response) {
            // Message is a sever response.
            this._handle_message_response(response);
        } else {
            // Message is a server message.
            this._handle_server_message(response);
        }
    },

    _handle_message_response: function(response) {
        var success = response[_WEB_SOCKET_RESPONSE_KEY_SUCCESS];
        success = success === _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE;

        var data = response[_WEB_SOCKET_RESPONSE_KEY_DATA];

        //l('It is a success :');
        //l(success);

        this._messages_in_limbo[response[_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID]].message_response(success, data);
        delete this._messages_in_limbo[response[_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID]];
    },

    _handle_server_message: function(response) {
        l('Handle sever message!');
        l(response);
        var message_type = response[_WEB_SOCKET_RESPONSE_KEY_MESSAGE_TYPE];
        switch (message_type) {
        case _WEB_SOCKET_RESPONSE_VALUE_MESSAGE_TYPE_CHAT_MESSAGE:
            this._server_message_chat_message.handle_message(response);
            break;
        }
    },

    _on_open: function() {
        //l('ON OPEN!');
    },

    _on_error: function(error) {
        l('ON ERROR:');
        l(error);
    },

    connect: function() {
        this.socket = new WebSocket(this._connection_string);
        this.socket.onmessage = this._message_received.bind(this);
        this.socket.onerror   = this._on_error.bind(this);
        this.socket.onopen    = this._on_open.bind(this);
    }

};
