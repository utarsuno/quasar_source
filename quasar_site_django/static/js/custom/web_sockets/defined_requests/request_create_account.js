'use strict';

function ServerRequestCreateAccount() {
    this.__init__();
}

ServerRequestCreateAccount.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT);
    }

};