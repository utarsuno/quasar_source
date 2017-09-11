'use strict'

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
