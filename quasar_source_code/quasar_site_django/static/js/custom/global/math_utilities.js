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
    left_right.cross(UP_VECTOR);
    left_right.normalize();
    return left_right;
}






function get_parametric_line_equation(position_vector, velocity_vector) {
    return [[position_vector.x, velocity_vector.x], [position_vector.y, velocity_vector.y], [position_vector.z, velocity_vector.z]];
}

function is_point_inside_floating_wall(x, y, z) {
    if (this.object3D.position.y + this.height / 2 < y) {
        return false;
    }
    if (this.object3D.position.y - this.height / 2 > y) {
        return false;
    }
    return this.get_horizontal_distance_to_center(x, z) <= this.width / 2;
}

function get_line_intersection_on_infinite_plane(line_parametric_equation, plane_parametric_equation) {
    var t = _calculate_t_value(line_parametric_equation, plane_parametric_equation);

}


/*

get_parametric_equation: function() {
        var position = this.get_position();
        var vector   = this.fps_controls.get_direction();
        return [[position.x, vector.x], [position.y, vector.y], [position.z, vector.z]];
},

get_parametric_value: function(t) {
    var position = this.get_position();
    var vector   = this.fps_controls.get_direction();
    return [position.x + vector.x * t, position.y + vector.y * t, position.z + vector.z * t];
}

*/


function get_position_from_line_parametric_equation(t_value) {

}


function get_position_on_parametric_line_equation(line_parametric_equation, t_value) {
    // 0, 1, 2 - x, y, z respectively

    // 0 - position index
    // 1 - velocity index
    return [line_parametric_equation[0][0] + line_parametric_equation[0][1] * t_value, line_parametric_equation[1][0] + line_parametric_equation[1][1] * t_value, line_parametric_equation[2][0] + line_parametric_equation[2][1] * t_value];
}