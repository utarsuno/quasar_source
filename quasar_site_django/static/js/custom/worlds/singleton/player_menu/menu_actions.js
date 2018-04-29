'use strict';

function MenuActions() {

    this.action_fullscreen = function() {
        CURRENT_CLIENT.toggle_fullscreen();
        this._set_to_invisible();
    };

    this.action_logout = function() {
        CURRENT_CLIENT.logout();
        this._set_to_invisible();
    };

    /*__   __   ___      ___  ___          __  ___    __        __
     /  ` |__) |__   /\   |  |__      /\  /  `  |  | /  \ |\ | /__`
     \__, |  \ |___ /~~\  |  |___    /~~\ \__,  |  | \__/ | \| .__/ */
    this.action_create_new_dynamic_world = function() {
        this._set_to_invisible();
    };

    this.action_create_new_month_view = function() {
        MANAGER_WORLD.current_world.create_new_month_view_wall();
        this._set_to_invisible();
    };

    this.action_create_new_floating_text = function() {
        this._set_to_invisible();
    };

    this.action_create_new_entity_group = function() {
        MANAGER_WORLD.current_world.create_new_entity_group();
        this._set_to_invisible();
    };

    this.action_create_new_picture = function() {
        this._set_to_invisible();
    };

    this.action_create_new_video = function() {
        this._set_to_invisible();
    };

    /*___  ___       ___  __   __   __  ___          __  ___    __        __
       |  |__  |    |__  |__) /  \ |__)  |      /\  /  `  |  | /  \ |\ | /__`
       |  |___ |___ |___ |    \__/ |  \  |     /~~\ \__,  |  | \__/ | \| .__/ */
    this.action_teleport_to_world = function(world) {
        MANAGER_WORLD.set_current_world(world);
        this._set_to_invisible();
    };

    /*__   ___  __        __           __  ___    __        __
     |  \ |__  |__) |  | / _`     /\  /  `  |  | /  \ |\ | /__`
     |__/ |___ |__) \__/ \__>    /~~\ \__,  |  | \__/ | \| .__/ */
    this.action_set_debug_to_none = function() {
        CURRENT_CLIENT.set_debug_mode(DEBUG_MODE_NONE);
        this._set_to_invisible();
    };

    this.action_set_debug_to_fps = function() {
        CURRENT_CLIENT.set_debug_mode(DEBUG_MODE_FPS);
        this._set_to_invisible();
    };

    this.action_set_debug_to_full = function() {
        CURRENT_CLIENT.set_debug_mode(DEBUG_MODE_FULL);
        this._set_to_invisible();
    };
}