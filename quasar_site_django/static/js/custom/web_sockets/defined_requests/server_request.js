'use strict';

const _WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE = 'r';
const _WEB_SOCKET_MESSAGE_ID               = 'm';
const _WEB_SOCKET_REQUEST_KEY_USERNAME     = 'u';
const _WEB_SOCKET_REQUEST_KEY_PASSWORD     = 'p';
const _WEB_SOCKET_REQUEST_KEY_EMAIL        = 'e';

const _WEB_SOCKET_REQUEST_LOGIN          = '1';
const _WEB_SOCKET_REQUEST_CREATE_ACCOUNT = '2';


function ServerRequest(request_type) {

    this._request_dictionary = {};
    this._request_dictionary[_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE] = request_type;

    this.set_message_id = function(message_id) {
        this._request_dictionary[_WEB_SOCKET_MESSAGE_ID] = message_id;
    };

    this.add_key_and_value = function(key, value) {
        this._request_dictionary[key] = value;
    };

    this.get_message = function() {
        return JSON.stringify(this._request_dictionary);
    };

    this.bind_to_button = function(button_to_bind_to) {
        this.binded_button = button_to_bind_to;
        this.binded_button.add_button_state();
    };

    this.bind_success_event = function(success_function) {
        // TODO : !!!
    };

    this.perform_request = function() {
        MANAGER_WEB_SOCKETS.send_message(this);
    };

    this.success_response = function() {

    };

    this.on_message_response = function() {

    };
}