'use strict';

const _WEB_SOCKET_KEY_TYPE    = 't';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_ID      = 'm';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_SUCCESS = 's';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_DATA    = 'd';  // #pre-process_global_constant

// Server response values.
const _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE  = 1; // #pre-process_global_constant
const _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_FALSE = 0; // #pre-process_global_constant


$_QE.prototype.WebSocketManager = function(engine) {
    this._engine         = engine;
    this._message_buffer = [];
    this._connected      = false;

    $_QE.prototype.WebSocketSession.call(this);
    $_QE.prototype.WebsocketRequestBuffer.call(this);

    this.set_message_parser = function(message_parser) {
        this._message_parser = message_parser;
        this._message_parser._websocket_manager = this;
    };

    this._on_message_received = function(message) {
        l('Message received!');
        l(message);
        let m = JSON.parse(message.data);

        if (_WEB_SOCKET_KEY_SUCCESS in m) {
            this._on_server_response(m);
        } else {
            this._message_parser.on_message_received(m);
        }
    };

    this.send_message = function(json_data) {
        this.socket.send(JSON.stringify(json_data));
    };

    this.send_request = function(json_data, callback) {
        this.socket.send(JSON.stringify(this._add_to_request_buffer(json_data, callback)));
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

    this.is_connected = function() {
        return this._connected;
    };

    this.connect = function() {
        //this.socket = new WebSocket(this._connection_string);
        this.socket = new WebSocket('ws://localhost:1337/ws/');
        this.socket.onmessage = this._on_message_received.bind(this);
        this.socket.onerror   = this._on_error.bind(this);
        this.socket.onopen    = this._on_open.bind(this);
        this.socket.onclose   = this._on_close.bind(this);
    };

    this.connect();

};
