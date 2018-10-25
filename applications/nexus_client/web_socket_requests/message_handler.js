'use strict';

// Message types.
const _WEB_SOCKET_TYPE_MESSAGE_CHAT = 'm0'; // #pre-process_global_constant
const _WEB_SOCKET_TYPE_REQUEST_CMD  = 'm1'; // #pre-process_global_constant
// Request types.


$_NL.prototype.WebsocketMessageHandler = function() {

    // Gets set by Quasar Engine.
    this._websocket_manager = null;

    this.parse_user_input_from_hud = function(user_input) {
        l('TODO: parse user input!');
        l('user input was {' + user_input + '}');
        QE.hud_chat.add_message(user_input);
        /*
            if (text.startsWith('>')) {
                this.websocket_message_parser.send_request_cmd(text.substring(1));
            } else {
                this.websocket_message_parser.send_request_chat(text);
            }
         */
    };

    this.send_request_chat = function(m) {
        //QE.hud_chat.add_text_line_to_bottom('you: ' + m, COLOR_CANVAS_TEAL);
        this._websocket_manager.send_request(
            {_WEB_SOCKET_KEY_TYPE: _WEB_SOCKET_TYPE_MESSAGE_CHAT, _WEB_SOCKET_KEY_DATA: m},
            this._on_message_response.bind(this));
    };

    this.send_request_cmd = function(m) {
        //QE.hud_chat.add_text_line_to_bottom('cmd: [' + m + ']', COLOR_CANVAS_GREEN);
        this._websocket_manager.send_request(
            {_WEB_SOCKET_KEY_TYPE: _WEB_SOCKET_TYPE_REQUEST_CMD, _WEB_SOCKET_KEY_DATA: m},
            this._on_message_response.bind(this));
    };

    this._on_message_response = function(m) {
        // TODO : check if it was an error response.
        l('ON Message Response:');
        l(m);
        //QE.hud_chat.add_text_line_to_bottom('s: [' + m[_WEB_SOCKET_KEY_DATA] + ']', COLOR_CANVAS_GREEN);
    };

    this.on_message_received = function(m) {
        l('NEED TO PARSE THE FOLLOWING MESSAGE!');
        l(m);

        l('-------');
    };


};
