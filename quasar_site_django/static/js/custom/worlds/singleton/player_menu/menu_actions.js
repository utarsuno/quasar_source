'use strict';

function MenuActions() {

    this.action_fullscreen = function() {
        MANAGER_RENDERER.toggle_fullscreen();
    };

    this.action_toggle_debugging = function() {
        l('TODO : Toggle debugging!!!');
    };

    this.action_logout = function() {
        l('TODO : Perform logout!!!');
    };

    /*__   __   ___      ___  ___          __  ___    __        __
     /  ` |__) |__   /\   |  |__      /\  /  `  |  | /  \ |\ | /__`
     \__, |  \ |___ /~~\  |  |___    /~~\ \__,  |  | \__/ | \| .__/ */
    this.action_create_new_dynamic_world = function() {

    };

    this.action_create_new_month_view = function() {

    };

    this.action_create_new_floating_text = function() {

    };

    this.action_create_new_entity_group = function() {

    };

    this.action_create_new_picture = function() {

    };

    this.action_create_new_video = function() {

    };

    /*___  ___       ___  __   __   __  ___          __  ___    __        __
       |  |__  |    |__  |__) /  \ |__)  |      /\  /  `  |  | /  \ |\ | /__`
       |  |___ |___ |___ |    \__/ |  \  |     /~~\ \__,  |  | \__/ | \| .__/ */
    this.action_teleport_to_world = function(world) {

    };
}
