'use strict';

function WorldState(default_world_enter_position, default_world_enter_look_at, custom_world_enter_function, custom_world_exit_function) {

    this.custom_world_enter_function = custom_world_enter_function;
    this.custom_world_exit_function  = custom_world_exit_function;

    this.default_world_enter_position = default_world_enter_position;
    this.default_world_enter_look_at  = default_world_enter_look_at;
    this.player_exit_position         = null;
    this.player_exit_look_at          = null;

    this.enter_world = function() {
        if (is_defined(this.custom_world_enter_function)) {
            this.custom_world_enter_function();
        }
        if (is_defined(this.player_exit_position)) {
            CURRENT_PLAYER.set_position_xyz(this.player_exit_position.x, this.player_exit_position.y, this.player_exit_position.z);
        } else {
            CURRENT_PLAYER.set_position_xyz(this.default_world_enter_position.x, this.default_world_enter_position.y, this.default_world_enter_position.z);
        }
        if (is_defined(this.player_exit_look_at)) {
            CURRENT_PLAYER.look_at(this.player_exit_look_at);
        } else if (is_defined(this.default_world_enter_look_at)) {
            CURRENT_PLAYER.look_at(this.default_world_enter_look_at);
        }
    };

    this.exit_world = function() {
        if (is_defined(this.custom_world_exit_function)) {
            this.custom_world_exit_function();
        }
        this.player_exit_position = CURRENT_PLAYER.get_position();
    };

}