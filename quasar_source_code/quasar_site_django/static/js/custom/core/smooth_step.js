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

function SmoothStep(current_value) {
    this.__init__(current_value)
}

SmoothStep.prototype = {

    buffer: null,

    current_value: null,

    __init__: function(current_value) {
        this.buffer = []
        this.current_value = current_value
    },

    add_force: function(magnitude, time_needed) {
        this.buffer.push([magnitude, 0.0, time_needed])
    },

    update: function(delta) {
        console.log('Delta is : ' + delta)
        for (var i = 0; i < this.buffer.length; i++) {
            this.buffer[i][1] += delta
        }
    }

}











/*
genType t; // Or genDType t;
    t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
*/

/*
float smoothstep(float edge0, float edge1, float x)
{
    // Scale, bias and saturate x to 0..1 range
    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0);
    // Evaluate polynomial
    return x*x*(3 - 2*x);
}

 */