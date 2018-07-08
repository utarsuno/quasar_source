'use strict';

$_QE.prototype.WebSocketMessage = function(message_type) {
    this._data_dictionary    = {_WEB_SOCKET_KEY_MESSAGE_TYPE: message_type};

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
