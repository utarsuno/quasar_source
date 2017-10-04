'use strict'


function clamp(x, lowerlimit, upperlimit) {
    if (x < lowerlimit) {
        x = lowerlimit
    }
    if (x > upperlimit) {
        x = upperlimit
    }
    return x
}

// min, max, t
function smoothstep(edge0, edge1, x) {
    // Scale, bias, and saturate x to 0....1 range
    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0)
    // Evaluate the polynomial.
    return x * x * (3 - 2 * x)
}

function SmoothStep(current_value, time_needed_for_each_force) {
    this.__init__(current_value, time_needed_for_each_force)
}

// TODO : Eventually make SmoothStep implement a large initially sized array instead of constantly needing to create new memory.

SmoothStep.prototype = {

    buffer: null,

    current_value: null,
    time_needed_for_each_force: null,

    __init__: function(current_value, time_needed_for_each_force) {
        this.buffer = []
        this.current_value = current_value
        this.time_needed_for_each_force = time_needed_for_each_force
    },

    add_force: function(magnitude) {
        this.buffer.push([magnitude, 0.0])
    },

    update: function(delta) {
        // console.log('The buffer has the length : ' + this.buffer.length)
        for (var i = 0; i < this.buffer.length; i++) {
            this.buffer[i][1] += delta
            if (this.buffer[i][1] >= this.time_needed_for_each_force) {
                this.current_value += this.buffer[i][0]
                // Remove this position.
                this.buffer.splice(i, 1)
            }
        }
    },

    get_current_value: function() {
        var value_instance = this.current_value
        for (var x = 0; x < this.buffer.length; x++) {
            value_instance += smoothstep(0.0, this.time_needed_for_each_force, this.buffer[x][1]) * this.buffer[x][0]
        }
        return value_instance
    }

}