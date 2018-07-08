'use strict';

$_QE.prototype.ServerRequest = function(request_type) {

    this._request_dictionary = {_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE: request_type};
    this.binded_button = null;
    this._manual_perform_request = false;

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

    this.bind_fail_event = function(fail_function) {
        this.fail_function = fail_function;
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
        if (!this._manual_perform_request) {
            MANAGER_WEB_SOCKETS.send_message(this);
        }
    };

    this.message_response = function(success, data) {
        if (is_defined(this._handle_response)) {
            this._handle_response(success, data);
        } else {
            this.unlock_button();
            if (success) {
                this.success_function();
            } else {
                CURRENT_CLIENT.add_server_message_red('Request failed. TODO : Better documentation.');
                if (is_defined(this.fail_function)) {
                    this.fail_function();
                }
            }
        }
    };

};