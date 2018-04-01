'use strict';

function MultiPlayerManager() {
    this.__init__();
}

function ServerPlayer(player_name, initial_position, initial_look_at) {
    this.__init__(player_name, initial_position, initial_look_at);
}

ServerPlayer.prototype = {
    __init__: function(player_name, initial_position, initial_look_at) {
        this.player_name = player_name;

        this.position = initial_position;
        this.look_at = initial_look_at;

        // TODO : title look at is definitly not working

        // TODO : server player objects need to contain a position smooth step buffer

        this.player_title = new Floating2DText(100, player_name, TYPE_TITLE, MANAGER_WORLD.world_home);
        var player_position = new THREE.Vector3(this.position.x, this.position.y + 10, this.position.z);


        this.position_x_buffer = new CustomSmoothStep(this.position.x, .1);
        this.position_y_buffer = new CustomSmoothStep(this.position.y, .1);
        this.position_z_buffer = new CustomSmoothStep(this.position.z, .1);


        var player_look_at = new THREE.Vector3(this.look_at.x, this.look_at.y + 10, this.look_at.z);
        this.player_title.update_position_and_look_at(player_position, player_look_at);

        this.geometry = new THREE.DodecahedronGeometry(10, 1);
        this.material = new THREE.MeshBasicMaterial({
            color: COLOR_PLANET[COLOR_HEX_INDEX],
            // TODO : Figure out if I should use front side or back side.
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        //this.mesh.position.set(this.position.x, this.position.y, this.position.z)

        this.mesh.material.color.setHex(COLOR_PLANET[COLOR_HEX_INDEX]);
        this.player_title.update_color(COLOR_PLANET);

        this.object3D = new THREE.Object3D();
        this.object3D.add(this.mesh);

        MANAGER_WORLD.world_home.add_to_scene(this.object3D);
    },

    update_position: function(position) {
        var current_x_position = this.position_x_buffer.get_full_value();
        var current_y_position = this.position_y_buffer.get_full_value();
        var current_z_position = this.position_z_buffer.get_full_value();

        var delta_x = position.x - current_x_position;
        var delta_y = position.y - current_y_position;
        var delta_z = position.z - current_z_position;

        if (delta_x !== 0) {
            this.position_x_buffer.add_force(delta_x);
        }
        if (delta_y !== 0) {
            this.position_y_buffer.add_force(delta_y);
        }
        if (delta_z !== 0) {
            this.position_z_buffer.add_force(delta_z);
        }
    },

    update_look_at: function(look_at) {
        //l('Updating the look at to :')
        //l(look_at)
        var new_look_at = new THREE.Vector3(look_at.x * 2 + this.object3D.position.x, look_at.y * 2 + this.object3D.position.y + 20, look_at.z * 2 + this.object3D.position.z);
        this.object3D.lookAt(new_look_at);
        this.player_title.update_look_at(new_look_at);
    },

    update: function(delta) {
        this.position_x_buffer.update(delta);
        this.position_y_buffer.update(delta);
        this.position_z_buffer.update(delta);

        this.object3D.position.x = this.position_x_buffer.get_current_value();
        this.object3D.position.y = this.position_y_buffer.get_current_value();
        this.object3D.position.z = this.position_z_buffer.get_current_value();

        this.player_title.object3D.position.x = this.object3D.position.x;
        this.player_title.object3D.position.y = this.object3D.position.y + 20;
        this.player_title.object3D.position.z = this.object3D.position.z;
    },

    remove: function() {
        MANAGER_WORLD.world_home.remove_from_scene(this.object3D);
        MANAGER_WORLD.world_home.remove_from_scene(this.player_title.object3D);

        // TODO : prevent memory-leaks!
    }
};

MultiPlayerManager.prototype = {

    players: null,

    __init__: function() {
        this.players = [];
    },

    update: function(delta) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].update(delta);
        }
    },

    remove_player: function(player) {
        var index_to_remove = -1;
        for (var i = 0; i < this.players.length; i++) {
            if (player === this.players[i].player_name) {
                index_to_remove = i;
                break;
            }
        }
        if (index_to_remove !== -1) {
            this.players[index_to_remove].remove();
            this.players.splice(index_to_remove, 1);
        }
    },

    perform_command: function(user, command, data) {
        //l('THE COMMAND IS FROM USER {' + user + '}');
        switch(command) {
        case WEB_SOCKET_MESSAGE_TYPE_ALL_PLAYERS:
            var players_data = data.split('@');
            for (var p = 0; p < players_data.length; p++) {
                var p_data = players_data[p].split('!');
                var p_name = p_data[0];
                var p_position = p_data[1];
                var p_look_at = p_data[2];

                this.update_player(p_name, this.get_vector_from_float_data(p_position), this.get_vector_from_float_data(p_look_at));
            }

            break;
        case WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED:
            GUI_TYPING_INTERFACE.add_server_message(user + ' has logged out!');
            this.remove_player(user);
            break;
        case WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE:
            GUI_TYPING_INTERFACE.add_chat_message(user + ' : ' + data);
            break;
        case WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE:
            this.update_player(user, null, this.get_vector_from_float_data(data));
            break;
        case WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE:
            this.update_player(user, this.get_vector_from_float_data(data), null);
            break;
        case WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE:
            var position = data.split('!')[0];
            var look_at = data.split('!')[1];
            this.update_player(user, this.get_vector_from_float_data(position), this.get_vector_from_float_data(look_at));
            break;
        }
    },

    update_player: function(server_player, position_update, look_at_update) {
        if (server_player !== ENTITY_OWNER.get_username()) {

            var user_index = -1;

            for (var i = 0; i < this.players.length; i++) {
                //l('does {' + this.players[i].player_id + '} match {' + player + '} ' + (this.players[i].player_id === server_player))
                if (this.players[i].player_name === server_player) {
                    user_index = i;
                }
            }

            if (user_index === -1) {
                if (!is_defined(position_update)) {
                    position_update = new THREE.Vector3(0, 0, 0);
                    // FOR_DEV_START
                    l('LOOK INTO WHY POSITION IS NOT DEFINED');
                    // FOR_DEV_END
                }
                if (!is_defined(look_at_update)) {
                    look_at_update = new THREE.Vector3(0, 0, 0);
                    // FOR_DEV_START
                    l('LOOK INTO WHY LOOK AT IS NOT DEFINED');
                    // FOR_DEV_END
                }

                this.players.push(new ServerPlayer(server_player, position_update, look_at_update));
                //l('There are now {' + this.players.length + '} players!')
            } else {
                if (is_defined(position_update)) {
                    this.players[user_index].update_position(position_update);
                }
                if (is_defined(look_at_update)) {
                    this.players[user_index].update_look_at(look_at_update);
                }
            }
        }
    },

    /*       ___  ___  __                          __   ___     ___            __  ___    __        __
      | |\ |  |  |__  |__) |\ |  /\  |       |  | /__` |__     |__  |  | |\ | /  `  |  | /  \ |\ | /__`
      | | \|  |  |___ |  \ | \| /~~\ |___    \__/ .__/ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    get_vector_from_float_data: function(string_of_floats) {
        var data_split = string_of_floats.split(',');
        return new THREE.Vector3(parseFloat(data_split[0]), parseFloat(data_split[1]), parseFloat(data_split[2]));
    }
};
