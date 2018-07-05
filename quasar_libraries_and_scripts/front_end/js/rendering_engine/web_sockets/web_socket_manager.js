'use strict';

const _WEB_SOCKET_KEY_MESSAGE_ID   = 'm';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_SUCCESS      = 's';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_DATA         = 'd';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_MESSAGE_TYPE = 't';  // #pre-process_global_constant

// Server response values.
const _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE  = 0; // #pre-process_global_constant
const _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_FALSE = 1; // #pre-process_global_constant


$_QE.prototype.WebSocketManager = function(engine) {
    this._engine = engine;
    /*
           // All the various server message types.
        this._server_message_chat_message = new ServerMessageChatMessage();

        // Inherit.
        ChatManager.call(this);

     */

    // TODO : Pre-process this
    this._connection_string = 'ws://' + window.location.host + '/ws/';
    this._messages = [];
    this._connected = false;

    this._get_message = function() {
        let m;
        for (m = 0; m < this._messages.length; m++) {
            if (!this._messages[m].alive) {
                return this._messages[m];
            }
        }
        m = new $_QE.prototype.WebSocketMessage(this, this._messages.length);
        this._messages.push(m);
        return m;
    };


    //


    /*
    this.send_message = function(message) {



        message.set_message_id(this._message_id);
        this._messages_in_limbo[this._message_id] = message;
        this._message_id += 1;
        this.socket.send(message.get_message());
    };


    this._handle_message_response = function(response) {
        let success = response[_WEB_SOCKET_KEY_SUCCESS] === _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE;
        let data = response[_WEB_SOCKET_KEY_DATA];

        //l('It is a success :');
        //l(success);

        this._messages_in_limbo[response[_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID]].message_response(success, data);
        delete this._messages_in_limbo[response[_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID]];
    };

    this._handle_server_message = function(response) {
        l('Handle sever message!');
        l(response);
        let message_type = response[_WEB_SOCKET_RESPONSE_KEY_MESSAGE_TYPE];
        switch (message_type) {
        case _WEB_SOCKET_RESPONSE_VALUE_MESSAGE_TYPE_CHAT_MESSAGE:
            this._server_message_chat_message.handle_message(response);
            break;
        }
    };
    */

    this._on_message_received = function(message) {
        l('Message received!');
        l(message);
        let response = JSON.parse(message.data).text;


        return;


        // TODO : Check if the message is a response or a server message.
        if (_WEB_SOCKET_KEY_SUCCESS in response) {
            // Message is a sever response.
            this._handle_server_response(response);
        } else {
            // Message is a server message.
            this._handle_server_message(response);
        }
    };

    this._on_open = function() {
        l('WEB-SOCKET OPENED!');
        this._connected = true;
    };

    this._on_error = function(error) {
        l('ON ERROR:');
        l(error);
    };

    this._on_close = function() {
        l('WEB-SOCKET CLOSED!');
        this._connected = false;
    };

    this.connect = function() {
        this.socket = new WebSocket(this._connection_string);
        this.socket.onmessage = this._on_message_received.bind(this);
        this.socket.onerror   = this._on_error.bind(this);
        this.socket.onopen    = this._on_open.bind(this);
        this.socket.onclose   = this._on_close.bind(this);
    };

    //this.on_message_completed_callback = this.

    this.connect();

};
