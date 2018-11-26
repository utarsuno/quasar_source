'use strict';

Object.assign(
    $_QE.prototype,
    {

        // Solution from: https://stackoverflow.com/questions/30924280/what-is-the-best-way-to-determine-if-a-given-number-is-a-power-of-two
        is_power_of_two: function(n) {
            return n && !(n & (n - 1));
        },

        // Solution from : https://stackoverflow.com/questions/4398711/round-to-the-nearest-power-of-two
        get_nearest_power_of_two_for_number: function(n) {
            let v = n;
            v--;
            v |= v >> 1;
            v |= v >> 2;
            v |= v >> 4;
            v |= v >> 8;
            v |= v >> 16;
            v++; // next power of 2
            let x = v >> 1; // previous power of 2
            return (v - n) > (n - x) ? x : v;
        },
    }
);

/*get_next_highest_power_of_two: function(n) {
            let v = n;
            v--;
            v |= v >> 1;
            v |= v >> 2;
            v |= v >> 4;
            v |= v >> 8;
            v |= v >> 16;
            v++; // next power of 2
            return v;
},
*/