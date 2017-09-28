'use strict'

// TODO : not priority for now

/*
function clamp(x, lowerlimit, upperlimit) {
    if (x < lowerlimit) {
        x = lowerlimit
    }
    if (x > upperlimit) {
        x = upperlimit
    }
    return x
}

function smoothstep(edge0, edge1, x) {
    // Scale, bias, and saturate x to 0....1 range
    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0)
    // Evaluate the polynomial.
    return x * x * (3 - 2 * x)
}

function SmoothStep() {

}

SmoothStep.prototype = {

    buffer: null,

    current_value: null,

    __init__: function() {
        // TODO : create dynamic list of buffers here.
    },

    add_force: function() {
        // TODO : Add a value to the buffer here, the value should contain the amount + time added at
    },

    update: function(delta) {
        // X seconds have passed.
        // TODO : Make sure delta is scaled to be Y seconds.


        // TODO : Any buffer elements that have had all their time elapsed should then be removed from the buffer.

    }

}
*/










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