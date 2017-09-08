'use strict'


function Client() {
    this.__init__()
}

Client.prototype = {

    _id       : null,
    connected : null,
    socket    : null,

    __init__: function() {
        // From https://gist.github.com/gordonbrander/2230317
        this._id       = '_' + Math.random().toString(36).substr(2, 9)
        this.connected = false
        this.connect()
    },

    send_data: function(data) {
        if (this.connected === true) {
            this.socket.send(this._id + data)
        }
    },

    connect: function () {
        var self       = this
        this.socket    = new WebSocket('ws://' + window.location.host + '/users/')
        this.connected = true

        this.socket.onmessage = function(e) {
            console.log('Just got the message : ' + e.data)
        }

        this.socket.onopen = function open() {
            console.log('WebSockets connection created.')
            //socket.send('Hello World!')
            self.connected = true
        }

        if (this.socket.readyState == WebSocket.OPEN) {
            this.socket.onopen()
        }
    }
}
