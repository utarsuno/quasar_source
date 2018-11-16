'use strict';

// Supports a maximum of 31 unique keys.
$_QE.prototype.BooleanFlagsStaticOneBucket = function(){};

$_QE.prototype.BooleanFlagsStaticOneBucket.prototype = {

    flags_clear: function() {
        this.flags[0] = 0;
    },

    flag_set: function(flag_number, b) {
        if (b) {
            // Flag set on.
            this.flags[0] |= flag_number;
        } else {
            // Flag set off.
            this.flags[0] &= (~flag_number);
        }
    },

    flag_set_off: function(flag_number) {
        this.flags[0] &= (~flag_number);
    },

    flag_set_on: function(flag_number) {
        this.flags[0] |= flag_number;
    },

    flag_get: function(flag_number) {
        return (this.flags[0] & flag_number) > 0;
    },

    flag_is_off: function(flag_number) {
        return (this.flags[0] & flag_number) == 0;
    },

    flag_is_on: function(flag_number) {
        return (this.flags[0] & flag_number) > 0;
    },

    flags_are_both_on: function(f0, f1) {
        return (this.flags[0] & (f0 | f1)) == (f0 | f1);
    },

    flags_are_either_on: function(f0, f1) {
        return (this.flags[0] & (f0 | f1)) > 0;
    },
};
