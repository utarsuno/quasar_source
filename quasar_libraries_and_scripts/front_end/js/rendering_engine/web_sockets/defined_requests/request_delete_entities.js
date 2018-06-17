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
        CURRENT_CLIENT.add_server_message_green('Sending delete request for deleted entities...');
    },

    set_deleted_entity_ids: function(deleted_ids) {
        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_DELETED_IDS, deleted_ids);
    },

    _handle_response: function(success, data) {
        if (success) {
            CURRENT_CLIENT.add_server_message_green('data deleted!');
            MANAGER_ENTITY.clear_deleted_entity_ids();
            this.success_function();
        } else {
            CURRENT_CLIENT.add_server_message_red('Error: {' + data + '}');
            this.fail_function();
        }
    }
};