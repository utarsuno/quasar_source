'use strict';

function ServerRequestLogin() {
    this.__init__();
}

ServerRequestLogin.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN);

        // The server request to login will also perform the request to load Entity data.
        this.server_request_load_entity_data = new ServerRequestLoadUserData();
        this.server_request_load_entity_data.bind_success_event(this._user_data_finished_loading.bind(this));
    },

    _perform_request: function() {
        CURRENT_CLIENT.add_server_message_green('Sending login request to server...');
    },

    _handle_response: function(success, data) {
        if (success) {
            MANAGER_AUDIO.play_sound(AUDIO_SOUND_SUCCESS);
            CURRENT_CLIENT.add_server_message_green('Login successful! Loading user data...');
            this._load_login_data();
        } else {
            this.unlock_button();
            MANAGER_AUDIO.play_sound(AUDIO_SOUND_ERROR);
            CURRENT_CLIENT.add_server_message_red('Error: {' + data + '}');
        }
    },

    _load_login_data: function() {
        this.server_request_load_entity_data.set_username(this._username);
        this.server_request_load_entity_data.set_password(this._password);
        this.server_request_load_entity_data.perform_request();
    },

    _user_data_finished_loading: function() {
        CURRENT_CLIENT.login_event(this._username);
        this.success_function();
        this.unlock_button();
    }
};
