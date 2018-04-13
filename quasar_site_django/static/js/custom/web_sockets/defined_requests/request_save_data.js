'use strict';

function ServerRequestSaveData() {
    this.__init__();
}

ServerRequestSaveData.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_SAVE_DATA);
    },

    _perform_request: function() {
        GUI_TYPING_INTERFACE.add_server_message('Sending save request...');

        // Get all the entities to save.
        this.entities_to_save = [];
        var all_entities = MANAGER_ENTITY.entities;
        for (var e = 0; e < all_entities.length; e++) {
            if (all_entities[e].needs_to_be_saved) {
                this.entities_to_save.push(all_entities[e]);
            }
        }
    },

    _handle_response: function(success, data) {
        if (success) {
            GUI_TYPING_INTERFACE.add_server_message('data saved!');

            for (var e = 0; e < this.entities_to_save.length; e++) {
                this.entities_to_save[e].needs_to_be_saved = false;
            }

            this.success_function();
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    }
};