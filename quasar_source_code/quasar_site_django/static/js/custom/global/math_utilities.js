'use strict';

/*    ___          ___         __   __        __  ___           ___  __
 |  |  |  | |    |  |  \ /    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 \__/  |  | |___ |  |   |     \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
// TODO : CodeAPI needs to treat some of these as #define statements and perfrom a pre-process on the code.
const DIAGONAL_PENALTY = Math.sqrt(.5);
const GROUND_NORMAL    = new THREE.Vector3(0, 1, 0);
const ONE_THIRD        = 1 / 3;
const ONE_FOURTH       = 1 / 4;
const THREE_FOURTHS    = 3 / 4;
const TWO_THIRDS       = 2 / 3;
const HALF_PIE         = Math.PI / 2.0;
const PIE              = Math.PI;
const TWO_PIE          = Math.PI * 2.0;
const HALF             = 0.5;

/*     __   __        __      __   __        __  ___           ___  __
 |  | /  \ |__) |    |  \    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 |/\| \__/ |  \ |___ |__/    \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
const UP_VECTOR = new THREE.Vector3(0, 1, 0);

/*    ___          ___         ___            __  ___    __        __
 |  |  |  | |    |  |  \ /    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 \__/  |  | |___ |  |   |     |    \__/ | \| \__,  |  | \__/ | \| .__/ */
function pow(n, p) {
    return Math.pow(n, p);
}

function cos(n) {
    return Math.cos(n);
}

function sin(n) {
    return Math.sin(n);
}

function sqrt(n) {
    return Math.sqrt(n);
}

function squared(n) {
    return n * n;
}

function round_to_n_decimal_places(text, n) {
    return Number(text).toFixed(n);
}

// From : https://stackoverflow.com/questions/4398711/round-to-the-nearest-power-of-two
function get_nearest_power_of_two_for_number(n) {
    var v = n;
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++; // next power of 2
    var x = v >> 1; // previous power of 2
    return (v - n) > (n - x) ? x : v;
}

/*__            __     __   __      ___            __  ___    __        __
 |__) |__| \ / /__` | /  ` /__`    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 |    |  |  |  .__/ | \__, .__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */

// TODO : add quality assurance to make sure x and z form a 2D unit vector. (Add the check only for DEV/QA mode)
function get_left_right_unit_vector(x, z) {
    var left_right = new THREE.Vector3(x, 0, z);
    left_right.crossVector(UP_VECTOR);
    left_right.normalize();
    return left_right;
}