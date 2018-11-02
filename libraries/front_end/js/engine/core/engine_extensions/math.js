'use strict';

/*    ___          ___         __   __        __  ___           ___  __
 |  |  |  | |    |  |  \ /    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 \__/  |  | |___ |  |   |     \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
const ONE_FOURTH       = 0.25;               // #pre-process_global_constant
const ONE_THIRD        = 0.3333333333333333; // #pre-process_global_constant
const THREE_FOURTHS    = 0.75;               // #pre-process_global_constant
const HALF             = 0.5;                // #pre-process_global_constant


//const TWO_THIRDS       = 0.6666666666666666; // #pre-process_global_constant
//const TWO_THIRDS       = 2 / 3;
//const ONE_THIRD        = 1 / 3;
//const DIAGONAL_PENALTY = Math.sqrt(.5);



Object.assign(
    $_QE.prototype,
    {

        // Solution from: https://stackoverflow.com/questions/30924280/what-is-the-best-way-to-determine-if-a-given-number-is-a-power-of-two.
        is_power_of_two: function(n) {
            return n && !(n & (n - 1));
        },

        get_next_highest_power_of_two: function(n) {
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

    }
);

