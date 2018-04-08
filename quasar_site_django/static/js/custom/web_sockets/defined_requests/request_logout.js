'use strict';

function ServerRequestLogout() {
    this.__init__();
}

ServerRequestLogout.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGOUT);

        // The server request to login will also perform the request to load Entity data.
        this.server_request_load_entity_data = new ServerRequestLoadUserData();
        this.server_request_load_entity_data.bind_success_event(this._user_data_finished_loading.bind(this));
    },

    _perform_request: function() {
        GUI_TYPING_INTERFACE.add_server_message('Sending login request to server...');
    },

    _handle_response: function(success, data) {
        if (success) {
            GUI_TYPING_INTERFACE.add_server_message('Login successful! Loading user data...');
            this._load_login_data();
        } else {
            this.unlock_button();
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    },

    _load_login_data: function() {
        l('TEMP LOGGING : LOADING USER DATA!!!');
        this.server_request_load_entity_data.set_username(this._username);
        this.server_request_load_entity_data.set_password(this._password);
        this.server_request_load_entity_data.perform_request();
    },

    _user_data_finished_loading: function() {
        l('USER DATA FINISHED LOADING!!!');



        this.unlock_button();
    }
};
