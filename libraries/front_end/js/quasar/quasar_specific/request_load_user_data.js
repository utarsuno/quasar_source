'use strict';

function ServerRequestLoadUserData() {
    this.__init__();
}

ServerRequestLoadUserData.prototype = {

    __init__: function() {
        // Inherit.
        ServerRequest.call(this, _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOAD_USER_DATA);
    },

    _handle_response: function(success, data) {
        if (success) {
            ENTITY_OWNER = new EntityOwner(this._username, this._password);

            CURRENT_CLIENT.add_server_message_green('User data loaded!');
            data = JSON.parse(data);

            // Load all the user entities.
            for (let entity in data) {
                if (data.hasOwnProperty(entity)) {
                    MANAGER_ENTITY.add_user_entity_from_entity_data(data[entity]);
                }
            }

            ENTITY_OWNER.set_owner_entity(MANAGER_ENTITY.get_owner_entity());

            MANAGER_ENTITY.link_entities();
            MANAGER_ENTITY.set_all_entities_to_not_needing_to_be_saved();

            CURRENT_CLIENT.add_server_message_green('Loading all content!');
            MANAGER_WORLD.all_entities_loaded(this._login_loading_completed.bind(this));
        } else {
            CURRENT_CLIENT.add_server_message_red('Error: {' + data + '}');
        }
    },

    _login_loading_completed: function() {
        this.success_function();
    }
};
