'use strict'


function WebSocketClient() {
    this.__init__()
}

function ClientManager() {
    this.__init__()
}

ClientManager.prototype = {
    __init__: function() {
        this.users = []
    },

    update_position: function(player, position, look_at) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i][0] === player) {
                this.users[i][1] = position
                this.users[i][2] = look_at
                MANAGER_WORLD.world_home.update_player_from_server(this.users[i])
            }
        }
    }
}

WebSocketClient.prototype = {

    _id       : null,
    connected : null,
    socket    : null,
    _world    : null,

    player_id : null,

    __init__: function() {
        //this._world    = world_object

        // TODO : REMOVE THIS, now just the player name can be used
        // From https://gist.github.com/gordonbrander/2230317
        //this._id       = '_' + Math.random().toString(36).substr(2, 9)
        //this._full_id  = '[user] ' + this._id


        this.client_manager = new ClientManager()


        this.connected = false

        //this.connect()
    },

    send_chat_message: function(chat_message) {
        if (this.connected) {
            this.socket.send(this.player_id + '|M|' + chat_message)
        }
    },

    send_position_update: function(data) {
        if (this.connected === true) {
            this.socket.send(this.player_id + '|P|' + data)
        }
    },

    connect: function (player_id) {

        this.player_id = player_id

        this.socket    = new WebSocket('ws://' + window.location.host + '/users/')
        this.connected = true

        this.socket.onmessage = function(e) {
            l('Just got the message : ' + e.data)

            var split = (e.data).split('|')
            var user = split[0]
            var command = split[1]
            var data = split[2]

            if (command === 'M') {
                GUI_TYPING_INTERFACE.add_chat_message(user + ' : ' + data)
            } else if (command === 'P') {
                var position = data.split('!')[0]
                var look_at = data.split('!')[1]

                var p = position.split(',')
                position = new THREE.Vector3(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]))
                var la = look_at.split(',')
                look_at = new THREE.Vector3(parseFloat(la[0]), parseFloat(la[1]), parseFloat(la[2]))


                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i][0] === user) {
                        this.users[i][1] = position
                        this.users[i][2] = look_at
                        MANAGER_WORLD.world_home.update_player_from_server(this.users[i])
                    }
                }


                //this.client_manager.update_position(user, position, look_at)
            }

            //var data = e.data.split('|')
            //self._world.update_player(data[0], data[1], data[2], data[3], data[4], data[5], data[6])
        }

        this.socket.onopen = function open() {
            l('WebSockets connection created.')
            //self._world.add_player(self._full_id)
            l('Adding player{' + this.player_id + '} to the world!')
            this.connected = true
        }.bind(this)

        if (this.socket.readyState == WebSocket.OPEN) {
            this.socket.onopen()
        }
    }
}

/*


function World(scene) {
    this.__init__(scene)
}


function Player(unique_id, scene) {
    this.__init__(unique_id, scene)
}

function CubeModel() {
    this.__init__()
}


CubeModel.prototype = {

    model   : null,
    geometry: null,
    material: null,

    __init__: function () {
        this.geometry = new THREE.BoxGeometry(6, 6, 6)
        this.material = new THREE.MeshLambertMaterial({color: 0x00ff00})
        this.model = new THREE.Mesh(this.geometry, this.material)
    }

}


Player.prototype = {

    unique_id: null,
    x_position: null,
    y_position: null,
    z_position: null,
    cube_model: null,

    __init__: function(unique_id, scene) {
        this.unique_id = unique_id
        this.cube_model = new CubeModel()
        scene.add(this.cube_model.model)
    },

    update: function(x_position, y_position, z_position, rx, ry, rz) {
        this.x_position = x_position
        this.y_position = y_position
        this.z_position = z_position

        this.cube_model.model.position.x = x_position
        this.cube_model.model.position.y = y_position
        this.cube_model.model.position.z = z_position

        this.half_pie = Math.PI / 2
        this.max_view_angle = this.half_pie * 0.9

        this.cube_model.model.rotation.x = rx
        this.cube_model.model.rotation.y = ry
        this.cube_model.model.rotation.z = rz

        //this.cube_model.model.position.set(this.x_position, 10, this.z_position)
    }

}


World.prototype = {

    players: null,
    scene  : null,

    __init__: function(scene) {
        this.players = []
        this.scene = scene
    },

    update_player: function(player_id, x_position, y_position, z_position, rx, ry, rz) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].unique_id === player_id) {
                this.players[i].update(x_position, y_position, z_position, rx, ry, rz)
                return
            }
        }
        // If the code reached this point that means the character was not found. So create it!
        this.add_player(player_id)
        this.update_player(player_id, x_position, y_position, z_position, rx, ry, rz)
    },

    add_player: function(unique_id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].unique_id === unique_id) {
                return
            }
        }
        // The player was not found so add the player.
        this.players.push(new Player(unique_id, this.scene))
    }

    // TODO : Remove player

}





*/
