'use strict';

//# Client request keys.
const _WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE = 'r';
const _WEB_SOCKET_REQUEST_KEY_MESSAGE_ID   = 'm';
const _WEB_SOCKET_REQUEST_KEY_USERNAME     = 'u';
const _WEB_SOCKET_REQUEST_KEY_PASSWORD     = 'p';
const _WEB_SOCKET_REQUEST_KEY_EMAIL        = 'e';

//# Client request values.
const _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN          = 1;
const _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT = 2;
const _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOAD_USER_DATA = 3;


function ServerRequest(request_type) {

    this._request_dictionary = {};
    this._request_dictionary[_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE] = request_type;
    this.binded_button = null;

    this.set_message_id = function(message_id) {
        this._request_dictionary[_WEB_SOCKET_REQUEST_KEY_MESSAGE_ID] = message_id;
    };

    this.add_key_and_value = function(key, value) {
        this._request_dictionary[key] = value;
    };

    this.get_value = function(key) {
        return this._request_dictionary[key];
    };

    this.get_message = function() {
        return JSON.stringify(this._request_dictionary);
    };

    this.bind_to_button = function(button_to_bind_to) {
        this.binded_button = button_to_bind_to;
        this.binded_button.add_button_state();
    };

    this.bind_success_event = function(success_function) {
        this.success_function = success_function;
    };

    this.lock_button = function() {
        if (is_defined(this.binded_button)) {
            this.binded_button.lock();
        }
    };

    this.unlock_button = function() {
        if (is_defined(this.binded_button)) {
            this.binded_button.unlock();
        }
    };

    this.perform_request = function() {
        this.lock_button();
        if (is_defined(this._perform_request)) {
            this._perform_request();
        }
        MANAGER_WEB_SOCKETS.send_message(this);
    };

    this.message_response = function(success, data) {
        if (is_defined(this._handle_response)) {
            this._handle_response(success, data);
        } else {
            this.unlock_button();
            if (success) {
                this.success_function();
            } else {
                GUI_TYPING_INTERFACE.add_server_message('Request failed. TODO : Better documentation.');
            }
        }
    };
}