'use strict';

function WorldState(default_world_enter_position, default_world_enter_look_at, custom_world_enter_function, custom_world_exit_function) {

    this.custom_world_enter_function = custom_world_enter_function;
    this.custom_world_exit_function  = custom_world_exit_function;

    this.default_world_enter_position = default_world_enter_position;
    this.default_world_enter_look_at  = default_world_enter_look_at;
    this.player_exit_position         = null;
    this.player_exit_look_at          = null;

    this.enter_world = function(current_cursor) {
        this.floating_cursor = current_cursor;

        if (is_defined(this.custom_world_enter_function)) {
            this.custom_world_enter_function();
        }


        l('Just entered a world!');
        l(this.player_exit_position);
        l(this.player_exit_look_at);
        l('---');
        l(this.default_world_enter_position);
        l(this.default_world_enter_look_at);

    };

    this.exit_world = function() {
        if (is_defined(this.custom_world_exit_function)) {
            this.custom_world_exit_function();
        }

        this.currently_looked_at_object = null;

        this.player_exit_position = CURRENT_PLAYER.get_position();
        this.player_exit_look_at = CURRENT_PLAYER.get_direction();
        l('Player exit position is : ');
        l(this.player_exit_position);
        this._set_player_exit_position_and_look_at();
        return [this.player_exit_position, this.player_exit_look_at];
    };

    this.set_player_enter_position_and_look_at = function() {
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

    this.get_player_enter_position = function() {
        if (is_defined(this.player_exit_position)) {
            return this.player_exit_position;
        } else {
            return this.default_world_enter_position;
        }
    };

    this.get_player_enter_look_at = function() {
        if (is_defined(this.player_exit_look_at)) {
            return this.player_exit_look_at;
        } else if (is_defined(this.default_world_enter_look_at)) {
            return this.default_world_enter_look_at;
        }
    };

    this._set_player_exit_position_and_look_at = function() {
        let p = CURRENT_PLAYER.get_position();
        let l = CURRENT_PLAYER.get_direction();
        this.player_exit_position = new THREE.Vector3(p.x, p.y, p.z);
        this.player_exit_look_at  = new THREE.Vector3(p.x + l.x, p.y + l.y, p.z + l.z);
    };

}
