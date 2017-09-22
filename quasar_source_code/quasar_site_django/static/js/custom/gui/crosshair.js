'use strict'

function Crosshair() {
    this.__init__()
}

Crosshair.prototype = {

    canvas: null,

    __init__: function() {
        this.canvas = document.getElementsByTagName('CANVAS')[0]

        // code modified from : https://stackoverflow.com/questions/44541915/javascript-canvas-crosshair-at-center
        this.context = this.canvas.getContext('2d')

        // center
        var x = window.innerWidth / 2
        var y = window.innerHeight / 2

        // remove aliasing
        x = Math.floor(x) + 0.5
        y = Math.floor(y) + 0.5
        this.context.strokeWidth = 1

        this.context.moveTo(x, y - 10)
        this.context.lineTo(x, y + 10)

        this.context.moveTo(x - 10,  y)
        this.context.lineTo(x + 10,  y)

        // Line color
        this.context.strokeStyle = 'green'

        this.context.stroke()
    }

}