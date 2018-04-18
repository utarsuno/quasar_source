'use strict';

function ServerRequestSaveData() {
    this.__init__();
}

ServerRequestSaveData.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_SAVE_DATA);

        // The server request to save will also perform the request to delete and deleted Entities.
        this.server_request_delete_entities = new ServerRequestDeleteEntities();
        this.server_request_delete_entities.bind_success_event(this._delete_event_success.bind(this));
        this.server_request_delete_entities.bind_fail_event(this._delete_event_failed.bind(this));
    },

    _perform_request: function() {
        CURRENT_CLIENT.add_server_message_green('Sending save request...');

        /*__   ___ ___     __             ___     __       ___
         / _` |__   |     /__`  /\  \  / |__     |  \  /\   |   /\
         \__> |___  |     .__/ /~~\  \/  |___    |__/ /~~\  |  /~~\ */
        MANAGER_WORLD.perform_batch_save();

        // Get all the entities to save.
        this.entities_to_save = [];
        let all_entities = MANAGER_ENTITY.entities;
        for (let e = 0; e < all_entities.length; e++) {
            if (all_entities[e].needs_to_be_saved) {
                this.entities_to_save.push(all_entities[e]);
            }
        }

        let save_data = {};
        for (let e = 0; e < this.entities_to_save.length; e++) {
            save_data[this.entities_to_save[e].get_relative_id()] = this.entities_to_save[e].get_all_properties();
        }

        this.add_key_and_value(_WEB_SOCKET_REQUEST_KEY_SAVE_DATA, save_data);

        /*__   ___ ___     __   ___       ___ ___  ___     __       ___
         / _` |__   |     |  \ |__  |    |__   |  |__     |  \  /\   |   /\
         \__> |___  |     |__/ |___ |___ |___  |  |___    |__/ /~~\  |  /~~\ */
        if (MANAGER_ENTITY.has_deleted_relative_ids()) {
            // Perform a delete first.
            this._manual_perform_request = true;
            this.server_request_delete_entities.set_deleted_entity_ids(MANAGER_ENTITY.get_deleted_relative_ids());
            this.server_request_delete_entities.perform_request();
        } else {
            // Since there was no delete event perform the request as needed.
            this._manual_perform_request = false;
        }
    },

    _handle_response: function(success, data) {
        if (success) {
            CURRENT_CLIENT.add_server_message_green('data saved!');

            for (let e = 0; e < this.entities_to_save.length; e++) {
                this.entities_to_save[e].needs_to_be_saved = false;
                this.entities_to_save[e].exists_on_server_side = true;
            }

            this.success_function();
        } else {
            CURRENT_CLIENT.add_server_message_red('Error: {' + data + '}');
        }
    },

    /*__   __   __  ___     __   ___       ___ ___  ___     ___       ___      ___  __
     |__) /  \ /__`  |     |  \ |__  |    |__   |  |__     |__  \  / |__  |\ |  |  /__`
     |    \__/ .__/  |     |__/ |___ |___ |___  |  |___    |___  \/  |___ | \|  |  .__/ */
    _delete_event_failed: function() {
        CURRENT_CLIENT.add_server_message_red('Can\'t perform a save event as deleting deleted Entities failed!');
    },

    _delete_event_success: function() {
        MANAGER_WEB_SOCKETS.send_message(this);
    }

};
