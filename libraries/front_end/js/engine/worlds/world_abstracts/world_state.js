'use strict';

$_QE.prototype.WorldState = function(default_enter_position, default_enter_normal, custom_enter_function, custom_exit_function) {

    this.on_world_enter                      = custom_enter_function;
    this.on_world_exit                       = custom_exit_function;

    this.player_default_enter_position       = default_enter_position;
    this.player_default_enter_normal         = default_enter_normal;

    this.player_last_position_and_normal_set = false;
    this.player_last_position                = new THREE.Vector3();
    this.player_last_normal                  = new THREE.Vector3();

    this.enter = function() {
        if (this.on_world_enter != null) {
            this.on_world_enter();
        }
        if (this.player_last_position_and_normal_set) {
            this.player.instant_teleport_to_xyz(
                this.player_last_position.x,
                this.player_last_position.y,
                this.player_last_position.z
            );
            this.player.set_normal_xyz(
                this.player_last_normal.x,
                this.player_last_normal.y,
                this.player_last_normal.z
            );
        } else {
            this.player.instant_teleport_to_xyz(
                this.player_default_enter_position.x,
                this.player_default_enter_position.y,
                this.player_default_enter_position.z
            );
            this.player.set_normal_xyz(
                this.player_default_enter_normal.x,
                this.player_default_enter_normal.y,
                this.player_default_enter_normal.z
            );
        }
    };

    this.exit = function() {
        if (this.on_world_exit != null) {
            this.on_world_exit();
        }
        let pp = this.player.get_position();
        let pn = this.player.get_normal();

        // TODO: Refactor this?
        this.currently_looked_at_object = null;

        this.player_last_position_and_normal_set = true;
        this.player_last_position.set(pp.x, pp.y, pp.z);
        this.player_last_normal.set(pn.x, pn.y, pn.z);
    };

    /*
    this.set_player_enter_position_and_look_at = function() {
        l('set_player_enter_position_and_look_at called!');
        if (is_defined(this.player_exit_position)) {
            this.player.set_position_xyz(this.player_exit_position.x, this.player_exit_position.y, this.player_exit_position.z);
        } else {
            l('Setting players position XYZ!');
            this.player.set_position_xyz(this.default_world_enter_position.x, this.default_world_enter_position.y, this.default_world_enter_position.z);
        }
        if (is_defined(this.player_exit_look_at)) {
            this.player.look_at(this.player_exit_look_at);
        } else if (is_defined(this.default_world_enter_look_at)) {
            this.player.look_at(this.default_world_enter_look_at);
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
    */

};