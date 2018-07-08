'use strict';

// Message types.
const _WEB_SOCKET_TYPE_MESSAGE_CHAT = 'm0'; // #pre-process_global_constant
const _WEB_SOCKET_TYPE_REQUEST_CMD  = 'm1'; // #pre-process_global_constant
// Request types.


$_NL.prototype.WebsocketMessageHandler = function() {

    // Gets set by Quasar Engine.
    this._websocket_manager = null;

    this.send_request_chat = function(m) {
        NL.gui_2d_logs.add_row('you: ' + m);
        this._websocket_manager.send_request(
            {_WEB_SOCKET_KEY_TYPE: _WEB_SOCKET_TYPE_MESSAGE_CHAT, _WEB_SOCKET_KEY_DATA: m},
            this._on_message_response.bind(this));
    };

    this.send_request_cmd = function(m) {
        NL.gui_2d_logs.add_row('cmd: [' + m + ']');
        this._websocket_manager.send_request(
            {_WEB_SOCKET_KEY_TYPE: _WEB_SOCKET_TYPE_REQUEST_CMD, _WEB_SOCKET_KEY_DATA: m},
            this._on_message_response.bind(this));
    };

    this._on_message_response = function(m) {
        // TODO : check if it was an error response.
        NL.gui_2d_logs.add_row('s: [' + m[_WEB_SOCKET_KEY_DATA] + ']');
    };

    this.on_message_received = function(m) {
        l('NEED TO PARSE THE FOLLOWING MESSAGE!');
        l(m);
        l('-------');
    };


};
