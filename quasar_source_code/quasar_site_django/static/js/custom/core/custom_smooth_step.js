'use strict';

// TODO : This file needs to be optimized since it's going to be used in many spots.

function clamp(x, lowerlimit, upperlimit) {
    if (x < lowerlimit) {
        x = lowerlimit;
    }
    if (x > upperlimit) {
        x = upperlimit;
    }
    return x;
}

// min, max, t
function smoothstep(edge0, edge1, x) {
    // Scale, bias, and saturate x to 0....1 range
    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0);
    // Evaluate the polynomial.
    return x * x * (3 - 2 * x);
}

function CustomSmoothStep(current_value, time_needed_for_each_force, minimum_value, maximum_value) {
    this.__init__(current_value, time_needed_for_each_force, minimum_value, maximum_value);
}

CustomSmoothStep.prototype = {

    buffer: null,

    current_value: null,
    time_needed_for_each_force: null,

    minimum_value: null,
    maximum_value: null,

    __init__: function(current_value, percentage_of_second_for_each_force, minimum_value, maximum_value) {
        this.buffer = [];
        this.current_value = current_value;
        this.time_needed_for_each_force = percentage_of_second_for_each_force;
        this.minimum_value = minimum_value;
        this.maximum_value = maximum_value;
    },

    clear_buffer: function() {
        this.buffer.length = 0;
    },

    set_value: function(value) {
        this.current_value = value;
        if (this.minimum_value !== null) {
            if (this.current_value < this.minimum_value) {
                return this.minimum_value;
            }
        }
        if (this.maximum_value !== null) {
            if (this.current_value > this.maximum_value) {
                return this.maximum_value;
            }
        }
    },

    add_force: function(magnitude) {
        var current_value = this.get_current_value();
        var add_value = true;
        if (is_defined(this.minimum_value)) {
            if (current_value + magnitude < this.minimum_value) {
                // TODO : set it to the minimum value?
                add_value = false;
            }
        }
        if (is_defined(this.maximum_value)) {
            if (current_value + magnitude > this.maximum_value) {
                // TODO : set it to the maximum value
                add_value = false;
            }
        }
        if (add_value) {
            this.buffer.push([magnitude, 0.0]);
        }
    },

    update: function(delta) {
        // console.log('The buffer has the length : ' + this.buffer.length)
        for (var i = 0; i < this.buffer.length; i++) {
            this.buffer[i][1] += delta;
            if (this.buffer[i][1] >= this.time_needed_for_each_force) {
                this.current_value += this.buffer[i][0];
                // Remove this position.
                this.buffer.splice(i, 1);
            }
        }
    },

    _get_capped_value: function(value) {
        if (is_defined(this.minimum_value)) {
            if (value < this.minimum_value) {
                return this.minimum_value;
            }
        }
        if (is_defined(this.maximum_value)) {
            if (value > this.maximum_value) {
                return this.maximum_value;
            }
        }
        return value;
    },

    get_current_value: function() {
        var value_instance = this.current_value;
        for (var x = 0; x < this.buffer.length; x++) {
            value_instance += smoothstep(this.time_needed_for_each_force, this.buffer[x][1]) * this.buffer[x][0];
        }
        return this._get_capped_value(value_instance);
    },

    get_full_value: function() {
        var value_instance = this.current_value;
        for (var x = 0; x < this.buffer.length; x++) {
            value_instance += smoothstep(this.time_needed_for_each_force, this.time_needed_for_each_force) * this.buffer[x][0];
        }
        return this._get_capped_value(value_instance);
    }
};