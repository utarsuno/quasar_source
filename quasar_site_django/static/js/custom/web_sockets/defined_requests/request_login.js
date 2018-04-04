'use strict';

function ServerRequestLogin() {
    this.__init__();
}

ServerRequestLogin.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_LOGIN);
    },

    set_username: function(username) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_USERNAME, username);
    },

    set_password: function(password) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_PASSWORD, password);
    }
};
