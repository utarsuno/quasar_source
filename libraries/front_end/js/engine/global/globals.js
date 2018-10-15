'use strict';

// TODO : Organize.

// Math
function get_horizontal_distance(x0, x1, z0, z1) {
    return Math.sqrt((x1 - x0) * (x1 - x0) + (z1 - z0) * (z1 - z0));
};

// Emoji list.
const EMOJI_SLEEPING = '😴'; // #pre-process_global_constant
const EMOJI_NERD     = '🤓'; // #pre-process_global_constant
const EMOJI_ERROR    = '😫'; // #pre-process_global_constant

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
// Testing if this is fixed.
const l = console.log;

// Logical constants.
const NOT_FOUND = -1; // #pre-process_global_constant

function get_next_highest_power_of_two(n) {
    let v = n;
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++; // next power of 2
    return v;
}






////


