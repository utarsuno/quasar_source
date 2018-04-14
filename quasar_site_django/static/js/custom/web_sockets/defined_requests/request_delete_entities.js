'use strict';

function ServerRequestDeleteEntities() {
    this.__init__();
}

ServerRequestDeleteEntities.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_SAVE_DATA);
    },

    _perform_request: function() {
        GUI_TYPING_INTERFACE.add_server_message('Sending save request...');

        MANAGER_WORLD.perform_batch_save();

        // Get all the entities to save.
        this.entities_to_save = [];
        var all_entities = MANAGER_ENTITY.entities;
        for (var e = 0; e < all_entities.length; e++) {
            if (all_entities[e].needs_to_be_saved) {
                this.entities_to_save.push(all_entities[e]);
            }
        }

        var save_data = {};
        for (e = 0; e < this.entities_to_save.length; e++) {
            save_data[this.entities_to_save[e].get_relative_id()] = this.entities_to_save[e].get_all_properties();
        }

        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_SAVE_DATA, save_data);
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