
// Supports a maximum of 31 unique keys. (The last, 32nd, bit is not supported at the moment.)
let DataStructureBitwiseFlagsMax31       = function(){};
DataStructureBitwiseFlagsMax31.prototype = {

    flags_clear: function() {
        this.cached_ints[0] = 0;
    },

    flag_set: function(flag_number, b) {
        if (b) {
            this.cached_ints[0] |= flag_number;
        } else {
            this.cached_ints[0] &= (~flag_number);
        }
    },

    flag_set_off: function(flag_number) {
        this.cached_ints[0] &= (~flag_number);
    },

    flag_set_on: function(flag_number) {
        this.cached_ints[0] |= flag_number;
    },

    flag_is_off: function(flag_number) {
        return (this.cached_ints[0] & flag_number) === 0;
    },

    flag_is_on: function(flag_number) {
        return (this.cached_ints[0] & flag_number) > 0;
    },

    flags_are_same: function(f0, f1) {
        return ((this.cached_ints[0] & (f0 | f1)) === (f0 | f1)) || ((this.cached_ints[0] & f0) + (this.cached_ints[0] & f1) === 0);
    },

    flags_are_on: function(f0, f1) {
        return (this.cached_ints[0] & (f0 | f1)) === (f0 | f1);
    },

    flags_are_off: function(f0, f1) {
        return (this.cached_ints[0] & f0) + (this.cached_ints[0] & f1) === 0;
    },

    flags_are_either_on: function(f0, f1) {
        return (this.cached_ints[0] & (f0 | f1)) > 0;
    },
};

export default {
    lib_prototype: DataStructureBitwiseFlagsMax31.prototype
}
