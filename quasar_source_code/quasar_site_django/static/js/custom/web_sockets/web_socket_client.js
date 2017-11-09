'use strict'


function WebSocketClient() {
    this.__init__()
}

WebSocketClient.prototype = {

    _id       : null,
    connected : null,
    socket    : null,
    _world    : null,

    player_id : null,

    __init__: function() {
        this.connected = false
    },

    send_chat_message: function(chat_message) {
        if (this.connected) {
            this.socket.send(this.player_id + WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE + chat_message)
        }
    },

    send_position_and_look_at_update: function(position_string, look_at_string) {
        if (this.connected) {
            this.socket.send(this.player_id + WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE + position_string + '!' + look_at_string)
        }
    },

    send_look_at_update: function(data) {
        if (this.connected) {
            this.socket.send(this.player_id + WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE + data)
        }
    },

    send_position_update: function(data) {
        if (this.connected) {
            this.socket.send(this.player_id + WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE + data)
        }
    },

    connect: function (player_id) {

        this.player_id = player_id

        this.socket    = new WebSocket('ws://' + window.location.host + '/users/')
        this.connected = true

        this.socket.onmessage = function(e) {
            //l('Just got the message : ' + e.data)
            var split = (e.data).split('|')
            var user = split[0]
            var command = '|' + split[1] + '|'
            var data = split[2]
            MANAGER_MULTIPLAYER.perform_command(user, command, data)
        }.bind(this)

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
