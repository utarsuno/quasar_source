/**
 * Created by utarsuno on 3/2/18.
 */
OLD PLAYER CODE TO ORGANIZE

    log_out: function() {
        // TODO : Log out needs to be updated to be fully functional and bug free.

        // FOR_DEV_START
        l('LOG OUT needs to be updated!');
        // FOR_DEV_END

        MANAGER_ENTITY.clear_all();

        // TODO : Create generic functionality for worlds to handle when a player has logged out.
        MANAGER_WORLD.world_home.loaded_entities = false;

        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login);
        this.logged_in = false;
        // TODO : Notify the server that the player has logged out?
    },

    try_to_send_position_update_to_server: function() {
        var position = this.get_position();
        var position_string = '' + Math.round(position.x).toString() + ',' + Math.round(position.y).toString() + ',' + Math.round(position.z).toString();

        var position_was_different = false;
        var look_at_was_different = false;

        if (is_defined(this.previous_position_string)) {
            if (position_string !== this.previous_position_string) {
                position_was_different = true;
            }
        }
        this.previous_position_string = position_string;

        var look_at = this.fps_controls.get_direction();
        var look_at_string = look_at.x.toString() + ',' + look_at.y.toString() + ',' + look_at.z.toString();

        if (is_defined(this.previous_look_at_string)) {
            if (look_at_string !== this.previous_look_at_string) {
                look_at_was_different = true;
            }
        }
        this.previous_look_at_string = look_at_string;

        if (position_was_different && look_at_was_different) {
            this.web_socket_client.send_position_and_look_at_update(position_string, look_at_string);
        } else if (position_was_different) {
            this.web_socket_client.send_position_update(position_string);
        } else if (look_at_was_different) {
            this.web_socket_client.send_look_at_update(look_at_string);
        }
    },

    // TODO : Update multi-player.
    set_player_id: function(player_id) {
        l('Setting the player id to : ' + player_id);
        this.player_id = player_id;
        this.web_socket_client.connect(ENTITY_OWNER);
    },







OLD MAIN LOOP CODE

        if (!MANAGER_LOADING._currently_creating_world) {
            MANAGER_RENDERER.pre_render();

            this.time = performance.now();
            this.delta = (this.time - this.previous_time) / 1000.0;

            MANAGER_DATA_DISPLAY.update();

            //MANAGER_MULTIPLAYER.update(delta);
            CURRENT_PLAYER.update(this.delta);
            MANAGER_WORLD.update_current_world(this.delta);

            ////
            if (GUI_TYPING_INTERFACE.needs_an_update()) {
                GUI_TYPING_INTERFACE.update();
            }
            ////

            MANAGER_RENDERER.render();
            MANAGER_RENDERER.post_render();
            this.previous_time = this.time;
        }