'use strict';

function SessionManager() {

    this.server_request_logout = new ServerRequestLogout();

    this.login_event = function(username) {
        this.server_request_logout.set_username(username);
        this.server_request_logout.bind_success_event(this.logout_success.bind(this));
    };

    this.logout = function() {
        this.server_request_logout.perform_request();
    };

    this.logout_success = function() {
        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login, this.transition_to_login_world_completed.bind(this));
    };

    this.transition_to_login_world_completed = function() {
        //MANAGER_ENTITY.logout();
        //ENTITY_OWNER.logout();
        //MANAGER_WORLD.logout();
    };

}