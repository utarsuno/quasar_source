'use strict';

function SessionManager() {

    this.server_request_logout = new ServerRequestLogout();
    this.server_request_batch_save = new ServerRequestSaveData();

    this.login_event = function(username) {
        this.server_request_logout.set_username(username);
        this.server_request_logout.bind_success_event(this.logout_success.bind(this));
        this.server_request_batch_save.set_username(username);
        this.server_request_batch_save.bind_success_event(this.batch_save_success.bind(this));
    };

    /*__                    __
     /__`  /\  \  / | |\ | / _`
     .__/ /~~\  \/  | | \| \__> */
    this.perform_batch_save = function() {

    };

    this.batch_save_success = function() {

    };

    /*     __   __   __       ___
     |    /  \ / _` /  \ |  |  |
     |___ \__/ \__> \__/ \__/  |  */
    this.logout = function() {
        l('Performing the log out request!');

        // TODO : Disable automatic saving before performing the save!

        // TODO : Perform a batch save first.
        this.server_request_batch_save.bind_success_event(this.batch_save_before_logout_success.bind(this));
        this.server_request_batch_save.perform_request();
    };

    this.batch_save_before_logout_success = function() {
        this.server_request_logout.perform_request();
    };

    this.logout_success = function() {
        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login, this.transition_to_login_world_completed.bind(this));
    };

    this.transition_to_login_world_completed = function() {
        MANAGER_ENTITY.logout();
        ENTITY_OWNER.logout();
        MANAGER_WORLD.logout();
    };

}