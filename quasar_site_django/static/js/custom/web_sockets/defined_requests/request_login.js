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


/*

this._handle_success();this.binded_button.unlock();

 */



/*
    this.message_response = function(success) {
        if (is_defined(this._handle_success)) {
            this._handle_success();
        } else {
            this.binded_button.unlock();
            if (success) {
                this.success_function();
            } else {
                GUI_TYPING_INTERFACE.add_server_message('Request failed. TODO : Better documentation.');
            }
        }
    };

 */




/*


    // LOADING MANAGER PERFROM LOGIN LOAD
    perform_login_load: function(username, password) {
        CURRENT_PLAYER.set_state(PLAYER_STATE_LOADING);

        GUI_PAUSED_MENU.set_text('Loading!');
        GUI_PAUSED_MENU.set_sub_text('creating static and dynamic worlds');
        GUI_PAUSED_MENU.make_visible();

        ENTITY_OWNER = new EntityOwner(username, password);
        MANAGER_ENTITY.load_data();
    },


 */




/*

    // FROM ENTITY_MANAGER
    load_data: function() {
        this.loading = true;
        var data = {};
        data[ENTITY_PROPERTY_USERNAME] = ENTITY_OWNER.get_username();
        data[ENTITY_PROPERTY_PASSWORD] = ENTITY_OWNER.get_password();
        this.post_load_user_entities.perform_post(data, this.all_user_entities_loaded.bind(this));
    },

 */