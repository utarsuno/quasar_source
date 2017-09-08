'use strict'


function Client(world_object) {
    this.__init__(world_object)
}

Client.prototype = {

    _id       : null,
    connected : null,
    socket    : null,
    _world    : null,

    __init__: function(world_object) {
        this._world    = world_object
        // From https://gist.github.com/gordonbrander/2230317
        this._id       = '_' + Math.random().toString(36).substr(2, 9)
        this._full_id  = '[user] ' + this._id
        this.connected = false
        this.connect()
    },

    send_data: function(data) {
        if (this.connected === true) {
            this.socket.send(this._id + '|' + data)
        }
    },

    connect: function () {
        var self       = this
        this.socket    = new WebSocket('ws://' + window.location.host + '/users/')
        this.connected = true

        this.socket.onmessage = function(e) {
            console.log('Just got the message : ' + e.data)
            var data = e.data.split('|')
            self._world.update_player(data[0], data[1], data[2])
        }

        this.socket.onopen = function open() {
            console.log('WebSockets connection created.')
            self._world.add_player(this._full_id)
            console.log('Adding player{' + this._full_id + '} to the world!')
            self.connected = true
        }

        if (this.socket.readyState == WebSocket.OPEN) {
            this.socket.onopen()
        }
    }
}
