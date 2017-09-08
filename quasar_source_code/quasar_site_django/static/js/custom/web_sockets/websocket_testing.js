'use strict'

var socket = new WebSocket('ws://' + window.location.host + '/users/')

var connection_made = false

socket.onmessage = function(e) {
    console.log('Just got the message : ')
    console.log(e)

}

socket.onopen = function open() {
    console.log('WebSockets connection created.')
    //socket.send('Hello World!')
    connection_made = true
}

if (socket.readyState == WebSocket.OPEN) {
    socket.onopen()
}


setInterval(function() {
    if (connection_made === true) {
        socket.send('Hello world!')
    }
}, 2000)