'use strict';

function ServerRequestLoadUserData() {
    this.__init__();
}

ServerRequestLoadUserData.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOAD_USER_DATA);
    },

    set_username: function(username) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_USERNAME, username);
    },

    set_password: function(password) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_PASSWORD, password);
    },

    _handle_response: function(success, data) {
        if (success) {
            GUI_TYPING_INTERFACE.add_server_message('User data loaded!');
            l('THE USER DATA IS :');
            l(data);


            for (var d in data) {
                if (data.hasOwnProperty(d)) {
                    l(d);
                }
            }


            this.success_function();
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    }
};



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



/*


    this.message_response = function(success) {
        if (is_defined(this._handle_success)) {
            this._handle_success();
        } else {
            if (is_defined(this.binded_button)) {
                this.binded_button.unlock();
            }
            if (success) {
                this.success_function();
            } else {
                GUI_TYPING_INTERFACE.add_server_message('Request failed. TODO : Better documentation.');
            }
        }
    };


 */