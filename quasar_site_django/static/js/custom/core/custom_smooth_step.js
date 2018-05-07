'use strict';

/*
function clamp(x, lowerlimit, upperlimit) {
    if (x < lowerlimit) {
        x = lowerlimit;
    }
    if (x > upperlimit) {
        x = upperlimit;
    }
    return x;
}
*/

// min, max, t
//function smoothstep(edge0, edge1, x) {
//    // Scale, bias, and saturate x to 0....1 range
//    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0);
//    // Evaluate the polynomial.
//    return x * x * (3 - 2 * x);
//}

function TimeValueBuffer(current_value, time_needed_for_each_force, minimum_value, maximum_value) {
    this.__init__(current_value, time_needed_for_each_force, minimum_value, maximum_value);
}

TimeValueBuffer.prototype = {

    __init__: function(current_value, percentage_of_second_for_each_force, minimum_value, maximum_value) {
        this.buffer                     = [];
        this.current_value              = current_value;
        this.time_needed_for_each_force = percentage_of_second_for_each_force;
        this.minimum_value              = minimum_value;
        this.maximum_value              = maximum_value;
    },

    clear_buffer: function() {
        let b;
        for (b = 0; b < this.buffer.length; b++) {
            this.buffer[b][2] = false;
        }
    },

    set_value: function(value) {
        this.current_value = value;
        if (is_defined(this.minimum_value)) {
            if (this.current_value < this.minimum_value) {
                return this.minimum_value;
            }
        }
        if (is_defined(this.maximum_value)) {
            if (this.current_value > this.maximum_value) {
                return this.maximum_value;
            }
        }
    },

    add_force: function(magnitude) {
        // Small optimization.
        if (magnitude === 0) {
            return;
        }

        // If there are no available slots then add a new cache position.
        let b;
        let slot_filled = false;
        for (b = 0; b < this.buffer.length; b++) {
            // If the buffer slot is not in use then assign it.
            if (!this.buffer[b][2]) {
                this.buffer[b][2] = true;
                this.buffer[b][0] = magnitude;
                this.buffer[b][1] = 0.0;
                slot_filled = true;
                break;
            }
        }

        if (!slot_filled) {
            this.buffer.push([magnitude, 0.0, true]);
        }
    },

    update: function(delta) {
        // console.log('The buffer has the length : ' + this.buffer.length)
        let b;
        for (b = 0; b < this.buffer.length; b++) {

            // Only update the delta of in-use slots.
            if (this.buffer[b][2]) {
                this.buffer[b][1] += delta;
                if (this.buffer[b][1] >= this.time_needed_for_each_force) {
                    this.current_value += this.buffer[b][0];

                    // Set this position as usable.
                    this.buffer[b][1] = 0.0;
                    this.buffer[b][2] = false;
                }
            }
        }

        this._cached_current_value = null;
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
        if (this._cached_current_value === null) {
            let value_instance = this.current_value;
            let x;
            for (x = 0; x < this.buffer.length; x++) {
                // Only use buffer values that are currently in use.
                if (this.buffer[x][2]) {
                    if (this.buffer[x][1] > this.time_needed_for_each_force) {
                        value_instance += this.buffer[x][0] * this.time_needed_for_each_force;
                    } else {
                        value_instance += this.buffer[x][0] * this.buffer[x][1];
                    }
                }
            }
            this._cached_current_value = this._get_capped_value(value_instance);
        }
        l('returning : ');
        l(this._cached_current_value);
        return this._cached_current_value;
    }
};