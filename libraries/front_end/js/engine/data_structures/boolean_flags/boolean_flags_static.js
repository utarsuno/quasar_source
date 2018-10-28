'use strict';

/*
$_QE.prototype.BooleanFlagsStatic = function(size, initialize_all_to_one=false){
    this.size  = size;
    this.flags = new Uint32Array(this.size);
    if (initialize_all_to_one) {
        this.enable_all();
    }
};
*/

$_QE.prototype.BooleanFlagsStatic = function(){};
$_QE.prototype.BooleanFlagsStatic.prototype = {

    //Utility function.
    _print_flags: function() {
        let i = 0;
        while (i < 50) {
            l(i + ' {' + this.get_flag(i) + '}.');
            i += 1;
        }
    },

    clear_flags: function() {
        this.flags[0] = 0;
        this.flags[1] = 0;
    },

    set_flag: function(flag_number, b) {
        if (b) {
            this.set_flag_on(flag_number);
        } else {
            this.set_flag_off(flag_number);
        }
    },

    set_flag_off: function(flag_number) {
        switch(flag_number) {
        case 0:
            this.flags[0] &= -2;
            break;
        case 1:
            this.flags[0] &= -3;
            break;
        case 2:
            this.flags[0] &= -5;
            break;
        case 3:
            this.flags[0] &= -9;
            break;
        case 4:
            this.flags[0] &= -17;
            break;
        case 5:
            this.flags[0] &= -33;
            break;
        case 6:
            this.flags[0] &= -65;
            break;
        case 7:
            this.flags[0] &= -129;
            break;
        case 8:
            this.flags[0] &= -257;
            break;
        case 9:
            this.flags[0] &= -513;
            break;
        case 10:
            this.flags[0] &= -1025;
            break;
        case 11:
            this.flags[0] &= -2049;
            break;
        case 12:
            this.flags[0] &= -4097;
            break;
        case 13:
            this.flags[0] &= -8193;
            break;
        case 14:
            this.flags[0] &= -16385;
            break;
        case 15:
            this.flags[0] &= -32769;
            break;
        case 16:
            this.flags[0] &= -65537;
            break;
        case 17:
            this.flags[0] &= -131073;
            break;
        case 18:
            this.flags[0] &= -262145;
            break;
        case 19:
            this.flags[0] &= -524289;
            break;
        case 20:
            this.flags[0] &= -1048577;
            break;
        case 21:
            this.flags[0] &= -2097153;
            break;
        case 22:
            this.flags[0] &= -4194305;
            break;
        case 23:
            this.flags[0] &= -8388609;
            break;
        case 24:
            this.flags[0] &= -16777217;
            break;
        case 25:
            this.flags[0] &= -33554433;
            break;
        case 26:
            this.flags[0] &= -67108865;
            break;
        case 27:
            this.flags[0] &= -134217729;
            break;
        case 28:
            this.flags[0] &= -268435457;
            break;
        case 29:
            this.flags[0] &= -536870913;
            break;
        case 30:
            this.flags[0] &= -1073741825;
            break;
        case 31:
            this.flags[1] &= -2;
            break;
        case 32:
            this.flags[1] &= -3;
            break;
        case 33:
            this.flags[1] &= -5;
            break;
        case 34:
            this.flags[1] &= -9;
            break;
        case 35:
            this.flags[1] &= -17;
            break;
        case 36:
            this.flags[1] &= -33;
            break;
        case 37:
            this.flags[1] &= -65;
            break;
        case 38:
            this.flags[1] &= -129;
            break;
        case 39:
            this.flags[1] &= -257;
            break;
        case 40:
            this.flags[1] &= -513;
            break;
        case 41:
            this.flags[1] &= -1025;
            break;
        case 42:
            this.flags[1] &= -2049;
            break;
        case 43:
            this.flags[1] &= -4097;
            break;
        case 44:
            this.flags[1] &= -8193;
            break;
        case 45:
            this.flags[1] &= -16385;
            break;
        case 46:
            this.flags[1] &= -32769;
            break;
        case 47:
            this.flags[1] &= -65537;
            break;
        case 48:
            this.flags[1] &= -131073;
            break;
        case 49:
            this.flags[1] &= -262145;
            break;
        case 50:
            this.flags[1] &= -524289;
            break;
        }
    },

    set_flag_on: function(flag_number) {
        switch(flag_number) {
        case 0:
            this.flags[0] |= 1;
            break;
        case 1:
            this.flags[0] |= 2;
            break;
        case 2:
            this.flags[0] |= 4;
            break;
        case 3:
            this.flags[0] |= 8;
            break;
        case 4:
            this.flags[0] |= 16;
            break;
        case 5:
            this.flags[0] |= 32;
            break;
        case 6:
            this.flags[0] |= 64;
            break;
        case 7:
            this.flags[0] |= 128;
            break;
        case 8:
            this.flags[0] |= 256;
            break;
        case 9:
            this.flags[0] |= 512;
            break;
        case 10:
            this.flags[0] |= 1024;
            break;
        case 11:
            this.flags[0] |= 2048;
            break;
        case 12:
            this.flags[0] |= 4096;
            break;
        case 13:
            this.flags[0] |= 8192;
            break;
        case 14:
            this.flags[0] |= 16384;
            break;
        case 15:
            this.flags[0] |= 32768;
            break;
        case 16:
            this.flags[0] |= 65536;
            break;
        case 17:
            this.flags[0] |= 131072;
            break;
        case 18:
            this.flags[0] |= 262144;
            break;
        case 19:
            this.flags[0] |= 524288;
            break;
        case 20:
            this.flags[0] |= 1048576;
            break;
        case 21:
            this.flags[0] |= 2097152;
            break;
        case 22:
            this.flags[0] |= 4194304;
            break;
        case 23:
            this.flags[0] |= 8388608;
            break;
        case 24:
            this.flags[0] |= 16777216;
            break;
        case 25:
            this.flags[0] |= 33554432;
            break;
        case 26:
            this.flags[0] |= 67108864;
            break;
        case 27:
            this.flags[0] |= 134217728;
            break;
        case 28:
            this.flags[0] |= 268435456;
            break;
        case 29:
            this.flags[0] |= 536870912;
            break;
        case 30:
            this.flags[0] |= 1073741824;
            break;
        case 31:
            this.flags[1] |= 1;
            break;
        case 32:
            this.flags[1] |= 2;
            break;
        case 33:
            this.flags[1] |= 4;
            break;
        case 34:
            this.flags[1] |= 8;
            break;
        case 35:
            this.flags[1] |= 16;
            break;
        case 36:
            this.flags[1] |= 32;
            break;
        case 37:
            this.flags[1] |= 64;
            break;
        case 38:
            this.flags[1] |= 128;
            break;
        case 39:
            this.flags[1] |= 256;
            break;
        case 40:
            this.flags[1] |= 512;
            break;
        case 41:
            this.flags[1] |= 1024;
            break;
        case 42:
            this.flags[1] |= 2048;
            break;
        case 43:
            this.flags[1] |= 4096;
            break;
        case 44:
            this.flags[1] |= 8192;
            break;
        case 45:
            this.flags[1] |= 16384;
            break;
        case 46:
            this.flags[1] |= 32768;
            break;
        case 47:
            this.flags[1] |= 65536;
            break;
        case 48:
            this.flags[1] |= 131072;
            break;
        case 49:
            this.flags[1] |= 262144;
            break;
        case 50:
            this.flags[1] |= 524288;
            break;
        }
    },

    get_flag: function(flag_number) {
        switch(flag_number) {
        case 0:
            return (this.flags[0] & 1)          > 0;
        case 1:
            return (this.flags[0] & 2)          > 0;
        case 2:
            return (this.flags[0] & 4)          > 0;
        case 3:
            return (this.flags[0] & 8)          > 0;
        case 4:
            return (this.flags[0] & 16)         > 0;
        case 5:
            return (this.flags[0] & 32)         > 0;
        case 6:
            return (this.flags[0] & 64)         > 0;
        case 7:
            return (this.flags[0] & 128)        > 0;
        case 8:
            return (this.flags[0] & 256)        > 0;
        case 9:
            return (this.flags[0] & 512)        > 0;
        case 10:
            return (this.flags[0] & 1024)       > 0;
        case 11:
            return (this.flags[0] & 2048)       > 0;
        case 12:
            return (this.flags[0] & 4096)       > 0;
        case 13:
            return (this.flags[0] & 8192)       > 0;
        case 14:
            return (this.flags[0] & 16384)      > 0;
        case 15:
            return (this.flags[0] & 32768)      > 0;
        case 16:
            return (this.flags[0] & 65536)      > 0;
        case 17:
            return (this.flags[0] & 131072)     > 0;
        case 18:
            return (this.flags[0] & 262144)     > 0;
        case 19:
            return (this.flags[0] & 524288)     > 0;
        case 20:
            return (this.flags[0] & 1048576)    > 0;
        case 21:
            return (this.flags[0] & 2097152)    > 0;
        case 22:
            return (this.flags[0] & 4194304)    > 0;
        case 23:
            return (this.flags[0] & 8388608)    > 0;
        case 24:
            return (this.flags[0] & 16777216)   > 0;
        case 25:
            return (this.flags[0] & 33554432)   > 0;
        case 26:
            return (this.flags[0] & 67108864)   > 0;
        case 27:
            return (this.flags[0] & 134217728)  > 0;
        case 28:
            return (this.flags[0] & 268435456)  > 0;
        case 29:
            return (this.flags[0] & 536870912)  > 0;
        case 30:
            return (this.flags[0] & 1073741824) > 0;
        // Lose 1 out of every 32 bits stored. (Okay for now).
        //case 31:
        //    return this.flags[0] & 2147483648 > 0;
        case 31:
            return (this.flags[1] & 1)          > 0;
        case 32:
            return (this.flags[1] & 2)          > 0;
        case 33:
            return (this.flags[1] & 4)          > 0;
        case 34:
            return (this.flags[1] & 8)          > 0;
        case 35:
            return (this.flags[1] & 16)         > 0;
        case 36:
            return (this.flags[1] & 32)         > 0;
        case 37:
            return (this.flags[1] & 64)         > 0;
        case 38:
            return (this.flags[1] & 128)        > 0;
        case 39:
            return (this.flags[1] & 256)        > 0;
        case 40:
            return (this.flags[1] & 512)        > 0;
        case 41:
            return (this.flags[1] & 1024)       > 0;
        case 42:
            return (this.flags[1] & 2048)       > 0;
        case 43:
            return (this.flags[1] & 4096)       > 0;
        case 44:
            return (this.flags[1] & 8192)       > 0;
        case 45:
            return (this.flags[1] & 16384)      > 0;
        case 46:
            return (this.flags[1] & 32768)      > 0;
        case 47:
            return (this.flags[1] & 65536)      > 0;
        case 48:
            return (this.flags[1] & 131072)     > 0;
        case 49:
            return (this.flags[1] & 262144)     > 0;
        case 50:
            return (this.flags[1] & 524288)     > 0;
        }
    },
};

/*
Object.assign($_QE.prototype.BooleanFlagsStatic.prototype, {


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

    set_flag: function(key, b) {
        if (b) {
            this.flags[key] = 1;
        } else {
            this.flags[key] = 0;
        }
    },

    get_flag: function(key) {
        return this.flags[key] == 1;
    },
});
*/