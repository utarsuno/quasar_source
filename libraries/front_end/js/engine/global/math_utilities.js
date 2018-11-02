'use strict';

/*    ___          ___         ___            __  ___    __        __
 |  |  |  | |    |  |  \ /    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 \__/  |  | |___ |  |   |     |    \__/ | \| \__,  |  | \__/ | \| .__/ */
// From : https://stackoverflow.com/questions/4398711/round-to-the-nearest-power-of-two
function get_nearest_power_of_two_for_number(n) {
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
}

/*__            __     __   __      ___            __  ___    __        __
 |__) |__| \ / /__` | /  ` /__`    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 |    |  |  |  .__/ | \__, .__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
// OPTIMIZE!
function get_player_blink_spot(distance) {
    let player_position = CURRENT_PLAYER.get_position();
    let player_normal   = CURRENT_PLAYER.get_direction();
    let new_position = new THREE.Vector3(player_position.x + player_normal.x * distance, player_position.y + player_normal.y * distance, player_position.z + player_normal.z * distance);
    let new_normal   = new THREE.Vector3(-player_normal.x, 0, -player_normal.z);
    return [new_position, new_normal];
}

function get_parametric_line_equation(position_vector, velocity_vector) {
    return [[position_vector.x, velocity_vector.x], [position_vector.y, velocity_vector.y], [position_vector.z, velocity_vector.z]];
}

function get_parametric_plane_equation(position_vector, normal_vector) {
    return [normal_vector.x, normal_vector.y, normal_vector.z, normal_vector.x * position_vector.x + normal_vector.y * position_vector.y + normal_vector.z * position_vector.z];
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

function _calculate_t_value(line_parametric_equation, plane_parametric_equation) {
    let line_x0 = line_parametric_equation[0][0];
    let line_y0 = line_parametric_equation[1][0];
    let line_z0 = line_parametric_equation[2][0];
    let line_nx = line_parametric_equation[0][1];
    let line_ny = line_parametric_equation[1][1];
    let line_nz = line_parametric_equation[2][1];
    let plane_nx = plane_parametric_equation[0];
    let plane_ny = plane_parametric_equation[1];
    let plane_nz = plane_parametric_equation[2];
    let plane_d  = plane_parametric_equation[3];
    return (plane_d - plane_nx * line_x0 - plane_ny * line_y0 - plane_nz * line_z0) / (plane_nx * line_nx + plane_ny * line_ny + plane_nz * line_nz);
}

// OPTIMIZE!
function get_line_intersection_on_infinite_plane(line_parametric_equation, plane_parametric_equation) {
    let t = _calculate_t_value(line_parametric_equation, plane_parametric_equation);
    return [line_parametric_equation[0][0] + line_parametric_equation[0][1] * t,
        line_parametric_equation[1][0] + line_parametric_equation[1][1] * t,
        line_parametric_equation[2][0] + line_parametric_equation[2][1] * t];
}
