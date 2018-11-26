'use strict';

/*
function get_horizontal_distance(x0, x1, z0, z1) {
    return Math.sqrt((x1 - x0) * (x1 - x0) + (z1 - z0) * (z1 - z0));
};
 */

/*__            __     __   __      ___            __  ___    __        __
 |__) |__| \ / /__` | /  ` /__`    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 |    |  |  |  .__/ | \__, .__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
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
