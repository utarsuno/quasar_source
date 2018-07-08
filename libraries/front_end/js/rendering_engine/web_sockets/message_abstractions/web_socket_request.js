'use strict';

$_QE.prototype.WebSocketMessage = function(web_socket_manager, message_id) {
    this.alive               = false;
    this._manager            = web_socket_manager;
    this._message_id         = message_id;
    this._data_dictionary    = {_WEB_SOCKET_KEY_MESSAGE_ID: message_id};

    this.add_key_and_value = function(key, value) {
        this._data_dictionary[key] = value;
    };

    this.get_value = function(key) {
        return this._data_dictionary[key];
    };

    this.get_message = function() {
        return JSON.stringify(this._data_dictionary);
    };
};
