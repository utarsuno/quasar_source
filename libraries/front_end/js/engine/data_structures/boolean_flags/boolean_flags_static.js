'use strict';

$_QE.prototype.BooleanFlagsStatic = function(size, initialize_all_to_one=false){
    this.size  = size;
    this.flags = new Uint32Array(this.size);
    if (initialize_all_to_one) {
        this.enable_all();
    }
};

Object.assign($_QE.prototype.BooleanFlagsStatic.prototype, {
    //constructor: $_QE.prototype.BooleanFlagsStatic,

    enable_all: function() {
        let i;
        for (i = 0; i < this.size; i++) {
            this.flags[i] = 1;
        }
    },

    disable_all: function() {
        let i;
        for (i = 0; i < this.size; i++) {
            this.flags[i] = 0;
        }
    },

    is_enabled: function(setting_key) {
        return this.flags[setting_key] == 1;
    },

    enable: function(setting_key) {
        this.flags[setting_key] = 1;
    },

    disable: function(setting_key) {
        this.flags[setting_key] = 0;
    },

    _set_flag: function(key, b) {
        if (b) {
            this.flags[key] = 1;
        } else {
            this.flags[key] = 0;
        }
    }
});
