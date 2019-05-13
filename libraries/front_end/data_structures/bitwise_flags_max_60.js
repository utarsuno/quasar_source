// Supports a maximum of 60 unique keys. (First bit used to indicate bucket {0 or 1}, usage of last bit currently not supported.)
let DataStructureBitwiseFlagsMax60       = function(){};
DataStructureBitwiseFlagsMax60.prototype = {

    flags_clear: function() {
        this.cached_ints[0] = 0;
        this.cached_ints[1] = 0;
    },

    flag_set: function(flag_number, b) {
        if (b) {
            this.cached_ints[flag_number & 1] |= (flag_number - (flag_number & 1));
        } else {
            this.cached_ints[flag_number & 1] &= (~(flag_number - (flag_number & 1)));
        }
    },

    flag_set_off: function(flag_number) {
        this.cached_ints[flag_number & 1] &= (~(flag_number - (flag_number & 1)));
    },

    flags_set_off: function(f0, f1) {
        this.cached_ints[f0 & 1] &= (~(f0 - (f0 & 1)));
        this.cached_ints[f1 & 1] &= (~(f1 - (f1 & 1)));
    },

    flag_set_on: function(flag_number) {
        this.cached_ints[flag_number & 1] |= (flag_number - (flag_number & 1));
    },

    flags_set_on: function(f0, f1) {
        this.cached_ints[f0 & 1] |= (f0 - (f0 & 1));
        this.cached_ints[f1 & 1] |= (f1 - (f1 & 1));
    },

    flag_is_off: function(flag_number) {
        return (this.cached_ints[flag_number & 1] & (flag_number - (flag_number & 1))) === 0;
    },

    flag_is_on: function(flag_number) {
        return (this.cached_ints[flag_number & 1] & (flag_number - (flag_number & 1))) > 0;
    },

    flags_are_same: function(f0, f1) {
        return (((this.cached_ints[f0 & 1] & (f0 - (f0 & 1))) > 0) && ((this.cached_ints[f1 & 1] & (f1 - (f1 & 1))) > 0)) || (((this.cached_ints[f0 & 1] & (f0 - (f0 & 1))) + (this.cached_ints[f1 & 1] & (f1 - (f1 & 1)))) === 0);
    },

    flags_are_on: function(f0, f1) {
        return ((this.cached_ints[f0 & 1] & (f0 - (f0 & 1))) > 0) && ((this.cached_ints[f1 & 1] & (f1 - (f1 & 1))) > 0);
    },

    flags_are_off: function(f0, f1) {
        return ((this.cached_ints[f0 & 1] & (f0 - (f0 & 1))) + (this.cached_ints[f1 & 1] & (f1 - (f1 & 1)))) === 0;
    },

    flags_are_either_on: function(f0, f1) {
        return ((this.cached_ints[f0 & 1] & (f0 - (f0 & 1))) > 0) || ((this.cached_ints[f1 & 1] & (f1 - (f1 & 1))) > 0);
    },

    flags_are_on_and_off: function(f0, f1) {
        return ((this.cached_ints[f0 & 1] & (f0 - (f0 & 1))) > 0) && ((this.cached_ints[f1 & 1] & (f1 - (f1 & 1))) === 0);
    },
};

export default {
    lib_prototype: DataStructureBitwiseFlagsMax60.prototype
}

