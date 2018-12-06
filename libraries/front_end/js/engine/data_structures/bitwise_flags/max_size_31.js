'use strict';

// Supports a maximum of 31 unique keys. (The last, 32nd, bit is not supported at the moment.)
$_QE.prototype.BitwiseFlagsMax31 = function(){};
$_QE.prototype.BitwiseFlagsMax31.prototype = {

    flags_clear: function() {
        this.flags[0] = 0;
    },

    flag_set: function(flag_number, b) {
        if (b) {
            this.flags[0] |= flag_number;
        } else {
            this.flags[0] &= (~flag_number);
        }
    },

    flag_set_off: function(flag_number) {
        this.flags[0] &= (~flag_number);
    },

    flag_set_on: function(flag_number) {
        this.flags[0] |= flag_number;
    },

    flag_is_off: function(flag_number) {
        return (this.flags[0] & flag_number) == 0;
    },

    flag_is_on: function(flag_number) {
        return (this.flags[0] & flag_number) > 0;
    },

    flags_are_same: function(f0, f1) {
        return ((this.flags[0] & (f0 | f1)) == (f0 | f1)) || ((this.flags[0] & f0) + (this.flags[0] & f1) == 0);
    },

    flags_are_both_on: function(f0, f1) {
        return (this.flags[0] & (f0 | f1)) == (f0 | f1);
    },

    flags_are_both_off: function(f0, f1) {
        return (this.flags[0] & f0) + (this.flags[0] & f1) == 0;
    },

    flags_are_either_on: function(f0, f1) {
        return (this.flags[0] & (f0 | f1)) > 0;
    },
};
