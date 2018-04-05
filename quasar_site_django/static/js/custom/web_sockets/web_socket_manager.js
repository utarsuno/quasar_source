'use strict';

function WebSocketManager() {
    this.__init__();
}

WebSocketManager.prototype = {

    __init__: function() {
        this._connection_string = 'ws://' + window.location.host + '/ws/';
        this._connected = false;
        this._messages_in_limbo = {};
        this._message_id = 0;
    },

    send_message: function(message) {
        message.set_message_id(this._message_id);
        this._messages_in_limbo[this._message_id] = message;
        this._message_id += 1;
        this.socket.send(message.get_message());
    },

    _message_received: function(message) {
        l('ON MESSAGE:');
        l(message);

        var response = JSON.parse(message.data);
        l(response);
        response = response.text;
        l(response);


        // TODO : Take the message out of limbo.
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




// REFACTOR THIS
/*
// UNIVERSAL_CONSTANTS_START : Web socket message types.
const WEB_SOCKET_MESSAGE_TYPE_ALL_PLAYERS                 = '|A|';
const WEB_SOCKET_MESSAGE_TYPE_CONNECTION                  = '|C|';
const WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED                = '|D|';
const WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE                = '|M|';
const WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE              = '|L|';
const WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE             = '|P|';
const WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE = '|U|';
// UNIVERSAL_CONSTANTS_END
 */
