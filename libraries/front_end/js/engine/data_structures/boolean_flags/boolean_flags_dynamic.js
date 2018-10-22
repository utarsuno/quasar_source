'use strict';

$_QE.prototype.BooleanFlagsDynamic = function() {};

Object.assign($_QE.prototype.BooleanFlagsDynamic.prototype, {

    //_flags: {},

    initialize_flags: function() {
        this._flags = {};
    },

    set_flag: function(flag, value=true) {
        this._flags[flag] = value;
    },

    has_flag: function(flag) {
        return flag in this._flags;
    },

    get_flag: function(flag) {
        return flag in this._flags ? this._flags[flag] : false;
    },

    are_flags_on_and_off_respectively: function(flag0, flag1) {
        return this.get_flag(flag0) && !this.get_flag(flag1);
    },

    are_both_flags_on: function(flag0, flag1) {
        return (flag0 in this._flags) && (flag1 in this._flags) && (this._flags[flag0]) && (this._flags[flag1]);
    },

    consume_flag: function(flag) {
        if (flag in this._flags) {
            if (this._flags[flag]) {
                this._flags[flag] = false;
                return true;
            }
            return false;
        }
        return false;
    },
});
