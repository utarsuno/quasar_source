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

            GUI_TYPING_INTERFACE.add_server_message('User data loaded!');
            data = JSON.parse(data);
            l(data);

            for (var e = 0; e < data.length; e++) {
                l(data[e]);
            }

            // Load all the user entities.
            for (var entity in data) {
                if (data.hasOwnProperty(entity)) {
                    MANAGER_ENTITY.add_user_entity_from_entity_data(data[entity]);
                }
            }

            ENTITY_OWNER.set_owner_entity(MANAGER_ENTITY.get_owner_entity());

            MANAGER_ENTITY.link_entities();
            MANAGER_ENTITY.set_all_entities_to_not_needing_to_be_saved();

            GUI_TYPING_INTERFACE.add_server_message('Loading all content!')
            MANAGER_WORLD.all_entities_loaded(this._login_loading_completed.bind(this));
        } else {
            GUI_TYPING_INTERFACE.add_server_message('Error: {' + data + '}');
        }
    },

    _login_loading_completed: function() {
        l('LOGIN LOADING COMPLETED!');
        this.success_function();
        // this.set_current_world(this.world_home);
    }
};
