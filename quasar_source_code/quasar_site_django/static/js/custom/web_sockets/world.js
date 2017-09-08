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
    z_position: null,
    cube_model: null,

    __init__: function(unique_id, scene) {
        this.unique_id = unique_id
        this.cube_model = new CubeModel()
        scene.add(this.cube_model.model)
    },

    update: function(x_position, z_position) {
        this.x_position = x_position
        this.z_position = z_position
        this.cube_model.model.position(this.x_position, 10, this.z_position)
    }

}

World.prototype = {

    players: null,
    scene  : null,

    __init__: function(scene) {
        this.players = []
        this.scene = scene
    },

    update_player: function(player_id, x_position, z_position) {
        for (var i = 0; i < this.players.length(); i++) {
            if (this.players[i].unique_id === player_id) {
                this.players[i].update(x_position, z_position)
                return
            }
        }
    },

    add_player: function(unique_id) {
        for (var i = 0; i < this.players.length(); i++) {
            if (this.players[i].unique_id === unique_id) {
                return
            }
        }
        // The player was not found so add the player.
        this.players.push(new Player(unique_id, this.scene))
    }

    // TODO : Remove player

}
