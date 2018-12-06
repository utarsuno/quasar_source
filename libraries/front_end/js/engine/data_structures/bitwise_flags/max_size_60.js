'use strict';

// Supports a maximum of 60 unique keys. (First bit used to indicate bucket {0 or 1}, usage of last bit currently not supported.)
$_QE.prototype.BitwiseFlagsMax60 = function(){};
$_QE.prototype.BitwiseFlagsMax60.prototype = {

    flags_clear: function() {
        this.flags[0] = 0;
        this.flags[1] = 0;
    },

    flag_set: function(flag_number, b) {
        if (b) {
            this.flags[flag_number & 1] |= (flag_number - (flag_number & 1));
        } else {
            this.flags[flag_number & 1] &= (~(flag_number - (flag_number & 1)));
        }
    },

    flag_set_off: function(flag_number) {
        this.flags[flag_number & 1] &= (~(flag_number - (flag_number & 1)));
    },

    flags_set_off: function(f0, f1) {
        this.flags[f0 & 1] &= (~(f0 - (f0 & 1)));
        this.flags[f1 & 1] &= (~(f1 - (f1 & 1)));
    },

    flag_set_on: function(flag_number) {
        this.flags[flag_number & 1] |= (flag_number - (flag_number & 1));
    },

    flags_set_on: function(f0, f1) {
        this.flags[f0 & 1] |= (f0 - (f0 & 1));
        this.flags[f1 & 1] |= (f1 - (f1 & 1));
    },

    flag_is_off: function(flag_number) {
        return (this.flags[flag_number & 1] & (flag_number - (flag_number & 1))) == 0;
    },

    flag_is_on: function(flag_number) {
        return (this.flags[flag_number & 1] & (flag_number - (flag_number & 1))) > 0;
    },

    flags_are_same: function(f0, f1) {
        return (((this.flags[f0 & 1] & (f0 - (f0 & 1))) > 0) && ((this.flags[f1 & 1] & (f1 - (f1 & 1))) > 0)) || (((this.flags[f0 & 1] & (f0 - (f0 & 1))) + (this.flags[f1 & 1] & (f1 - (f1 & 1)))) == 0);
    },

    flags_are_both_on: function(f0, f1) {
        return ((this.flags[f0 & 1] & (f0 - (f0 & 1))) > 0) && ((this.flags[f1 & 1] & (f1 - (f1 & 1))) > 0);
    },

    flags_are_both_off: function(f0, f1) {
        return ((this.flags[f0 & 1] & (f0 - (f0 & 1))) + (this.flags[f1 & 1] & (f1 - (f1 & 1)))) == 0;
    },

    flags_are_either_on: function(f0, f1) {
        return ((this.flags[f0 & 1] & (f0 - (f0 & 1))) > 0) || ((this.flags[f1 & 1] & (f1 - (f1 & 1))) > 0);
    },

    flags_are_on_and_off: function(f0, f1) {
        return ((this.flags[f0 & 1] & (f0 - (f0 & 1))) > 0) && ((this.flags[f1 & 1] & (f1 - (f1 & 1))) == 0);
    },
};
