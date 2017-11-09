'use strict'

function MultiPlayerManager() {
    this.__init__()
}

function Player() {
    this.__init__()
}

Player.prototype = {
    __init__: function(player_id, initial_position, initial_look_at) {
        this.player_id = player_id
        this.position = initial_position
        this.look_at = initial_look_at


        this.player_title = new Floating2DText(100, 'PLAYER NAME', TYPE_TITLE, MANAGER_WORLD.world_home.scene)
        var player_position = new THREE.Vector3(this.position.x, this.position.y + 10, this.position.z)
        var player_look_at = new THREE.Vector3(this.look_at.x, this.look_at.y + 10, this.look_at.z)
        this.player_title.update_position_and_look_at(player_position, player_look_at)

        this.geometry = new THREE.DodecahedronGeometry(10, 1)
        this.planet_color = 0x8effcb
        this.material = new THREE.MeshBasicMaterial({
            color: 0x8effcb, // '0x8effcb'
            // TODO : Figure out if I should use front side or back side.
            side: THREE.DoubleSide
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)

        this.mesh.material.color.setHex(COLOR_TEXT_PLANET)
        this.player_title.update_just_color(COLOR_TEXT_PLANET)

        this.object3D = new THREE.Object3D()
        this.object3D.add(this.mesh)

        MANAGER_WORLD.world_home.add_to_scene(this.object3D)
    },

    update_position: function(position) {
        this.object3D.position.x = position.x
        this.object3D.position.y = position.y
        this.object3D.position.z = position.z

        var p_position = new THREE.Vector3(position.x, position.y + 10, position.z)
        this.player_title.update_position(p_position)
    },

    update_look_at: function(look_at) {
        this.object3D.lookAt(look_at)
        var p_look_at = new THREE.Vector3(look_at.x, look_at.y + 10, look_at.z)
        this.player_title.update_look_at(p_look_at)
    }
}

MultiPlayerManager.prototype = {

    players: null,

    __init__: function() {
        this.players = []
    },

    update: function() {

    },

    perform_command: function(user, command, data) {
        switch(command) {
        case WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE:
            GUI_TYPING_INTERFACE.add_chat_message(user + ' : ' + data)
            break
        case WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE:
            this.update_player(user, null, this.get_rounded_vector_from_float_data(data))
            break
        case WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE:
            this.update_player(user, this.get_rounded_vector_from_float_data(data), null)
            break
        case WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE:
            var position = data.split('!')[0]
            var look_at = data.split('!')[1]
            this.update_player(user, this.get_rounded_vector_from_float_data(position), this.get_rounded_vector_from_float_data(look_at))
            break
        }
    },

    update_player: function(player, position_update, look_at_update) {
        if (player !== MANAGER_WORLD.player.player_id) {
            var user_index = -1
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].player_id === player) {
                    user_index = i
                }
            }
            if (user_index === -1) {
                if (!is_defined(position_update)) {
                    position_update = new THREE.Vector3(0, 0, 0)
                    l('LOOK INTO WHY POSITION IS NOT DEFINED')
                }
                if (!is_defined(look_at_update)) {
                    look_at_update = new THREE.Vector3(0, 0, 0)
                    l('LOOK INTO WHY LOOK AT IS NOT DEFINED')
                }
                this.players.push(new Player(player, position_update, look_at_update))
            } else {
                if (is_defined(position_update)) {
                    this.players[user_index].update_position(position_update)
                }
                if (is_defined(look_at_update)) {
                    this.players[user_index].update_look_at(look_at_update)
                }
            }
        }
    },

    /*       ___  ___  __                          __   ___     ___            __  ___    __        __
      | |\ |  |  |__  |__) |\ |  /\  |       |  | /__` |__     |__  |  | |\ | /  `  |  | /  \ |\ | /__`
      | | \|  |  |___ |  \ | \| /~~\ |___    \__/ .__/ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/ */

    get_rounded_vector_from_float_data: function(string_of_floats) {
        var data_split = string_of_floats.split(',')
        return new THREE.Vector3(Math.round(parseFloat(data_split[0])), Math.round(parseFloat(data_split[1])), Math.round(parseFloat(data_split[2])))
    }
}

