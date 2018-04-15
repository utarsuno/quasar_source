'use strict';

function ServerRequestDeleteEntities() {
    this.__init__();
}

ServerRequestDeleteEntities.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_DELETE_ENTITIES);
    },

    _perform_request: function() {
        GUI_TYPING_INTERFACE.add_server_message('Sending delete request for deleted entities...');
    },

    set_deleted_entity_ids: function(deleted_ids) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_DELETED_IDS, deleted_ids);
    },

    _handle_response: function(success, data) {
        if (success) {
            GUI_TYPING_INTERFACE.add_server_message('data deleted!');
            MANAGER_ENTITY.clear_deleted_entity_ids();
            this.success_function();
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
            this.fail_function();
        }
    }
};