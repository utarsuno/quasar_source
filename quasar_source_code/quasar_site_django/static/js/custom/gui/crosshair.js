'use strict'

function Crosshair(center_x, center_y) {
    this.__init__(center_x, center_y)
}

Crosshair.prototype = {

    canvas: null,
    x     : null,
    y     : null,

    __init__: function(center_x, center_y) {
        this.canvas = document.getElementsByTagName('CANVAS')[0]

        // code modified from : https://stackoverflow.com/questions/44541915/javascript-canvas-crosshair-at-center
        this.context = this.canvas.getContext('2d')

        this.set_center_x_center_y(center_x, center_y)
    },

    set_center_x_center_y: function(center_x, center_y) {
        // remove aliasing
        this.x = Math.floor(center_x) + 0.5
        this.y = Math.floor(center_y) + 0.5
        this.context.strokeWidth = 1

        this.context.moveTo(this.x, this.y - 10)
        this.context.lineTo(this.x, this.y + 10)

        this.context.moveTo(this.x - 10, this.y)
        this.context.lineTo(this.x + 10, this.y)

        // Line color
        this.context.strokeStyle = 'green'

        this.context.stroke()
    }

}