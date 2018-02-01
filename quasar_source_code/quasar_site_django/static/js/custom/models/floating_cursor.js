'use strict';

function FloatingCursor(world) {
    this.__init__(world);
}

FloatingCursor.prototype = {

    __init__: function(world) {
        this.world                 = world;
        this._cursors              = {};
        this.currently_attached_to = null;

        this._current_cursor       = null;
        this._previous_cursor      = null;

        this._currently_engaged    = false;
    },

    wheel_event: function(delta) {
        switch (delta) {
        case 1:
            this._horizontal_distance_to_player *= 1.1;
            break;
        case -1:
            this._horizontal_distance_to_player *= 0.9;
            break;
        }
    },

    engage: function() {
        this._currently_engaged = true;

        var h = this.currently_attached_to.height;

        var cursor_position = this.cursor_wall.get_position();

        this._previous_vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - cursor_position.y ) / h;

        // Save the initial position at the engage.
        this._previous_y = cursor_position.y;

        var pp = CURRENT_PLAYER.get_position();

        this._horizontal_distance_to_player = this.currently_attached_to.get_horizontal_distance_to_center(pp.x, pp.z);

        // TODO : TEMPORARY MEASURE.
        this._current_cursor.set_to_invisible();
    },

    disengage: function() {
        this._currently_engaged = false;

        // TODO : TEMPORARY MEASURE.
        this._current_cursor.set_to_visible();

        var plane_current_position = this.currently_attached_to.get_position();
        var player_parametric_equation = get_parametric_line_equation(CURRENT_PLAYER.get_position(), CURRENT_PLAYER.get_direction());
        var plane_parametric_equation = get_parametric_plane_equation(plane_current_position, this.currently_attached_to.get_normal());
        var current_position = get_line_intersection_on_infinite_plane(player_parametric_equation, plane_parametric_equation);

        if (this._is_current_cursor_type(CURSOR_TYPE_VERTICAL)) {
            var h = this.currently_attached_to.height;

            var current_vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - current_position[1] ) / h;

            // TODO : FIX HEIGHT CHANGES FROM THE BOTTOM!!!!

            current_vertical_percentage *= 2;
            current_vertical_percentage *= -1;
            this.currently_attached_to.update_height(1 + current_vertical_percentage);
            this.currently_attached_to.refresh_position_and_look_at();

        } else if (this._is_current_cursor_type(CURSOR_TYPE_HORIZONTAL)) {

            var w = this.currently_attached_to.width;

            var current_horizontal_percentage = this.currently_attached_to.get_horizontal_distance_to_center(current_position[0], current_position[2]) / w;

            current_horizontal_percentage = 0.5 - current_horizontal_percentage;
            current_horizontal_percentage *= 2;
            current_horizontal_percentage *= -1;

            //current_vertical_percentage *= -1;
            this.currently_attached_to.update_width(1 + current_horizontal_percentage);
            this.currently_attached_to.refresh_position_and_look_at();
        }

    },

    attach: function(object_to_attach_to) {
        this.currently_attached_to = object_to_attach_to;

        if (this.currently_attached_to.type === TYPE_BUTTON || this.currently_attached_to.type === TYPE_CHECK_BOX) {
            this._set_current_cursor(CURSOR_TYPE_HAND);
        } else if (this.currently_attached_to.scalable) {
            this._get_scalable_cursor_needed();
        } else {
            this._set_current_cursor(CURSOR_TYPE_POINTER);
        }
    },

    detach: function() {
        this._current_cursor.set_to_invisible();

        this.currently_attached_to = null;
        this._previous_cursor      = null;
        this._current_cursor       = null;
    },

    update_position: function(p) {
        var normal = this.currently_attached_to.get_normal();

        this.cursor_wall.set_position(p.x, p.y, p.z, false);
        this.cursor_wall.set_normal(normal.x, normal.y, normal.z, false);
        this.cursor_wall.refresh_position_and_look_at();
    },

    update: function() {
        if (this._currently_engaged) {

            var plane_current_position = this.currently_attached_to.get_position();

            var player_parametric_equation = get_parametric_line_equation(CURRENT_PLAYER.get_position(), CURRENT_PLAYER.get_direction());
            var plane_parametric_equation = get_parametric_plane_equation(plane_current_position, this.currently_attached_to.get_normal());

            var current_position = get_line_intersection_on_infinite_plane(player_parametric_equation, plane_parametric_equation);

            if (this._is_current_cursor_type(CURSOR_TYPE_MOUSE)) {
                var pp = CURRENT_PLAYER.get_position();
                var pn = CURRENT_PLAYER.get_direction();

                var new_x_position = pp.x + pn.x * this._horizontal_distance_to_player;
                var new_z_position = pp.z + pn.z * this._horizontal_distance_to_player;

                this.currently_attached_to.set_position(new_x_position, (current_position[1] - this._previous_y) + plane_current_position.y, new_z_position);
                this._previous_y = current_position[1];


                this.currently_attached_to.set_normal(-pn.x, 0, -pn.z);
                this.currently_attached_to.refresh_position_and_look_at();
            }


        } else {
            if (is_defined(this.currently_attached_to)) {
                if (this.currently_attached_to.scalable) {
                    this._get_scalable_cursor_needed();
                }
            }
        }
    },

    _get_scalable_cursor_needed: function() {
        var h = this.currently_attached_to.height;
        var w = this.currently_attached_to.width;

        var cursor_position = this.cursor_wall.get_position();

        var vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - cursor_position.y ) / h;
        var horizontal_percentage = this.currently_attached_to.get_horizontal_distance_to_center(cursor_position.x, cursor_position.z) / w;

        var scroll_vertical   = false;
        var scroll_horizontal = false;

        if (vertical_percentage < 0.03 || vertical_percentage > 0.97) {
            scroll_vertical = true;
        }

        if (horizontal_percentage > .47) {
            scroll_horizontal = true;
        }

        if (scroll_horizontal && scroll_vertical) {
            this._set_current_cursor(CURSOR_TYPE_LARGER);
        } else if (scroll_vertical) {
            this._set_current_cursor(CURSOR_TYPE_VERTICAL);
        } else if (scroll_horizontal) {
            this._set_current_cursor(CURSOR_TYPE_HORIZONTAL);
        } else {
            this._set_current_cursor(CURSOR_TYPE_MOUSE);
        }
    },

    _set_current_cursor: function(cursor) {
        if (this._current_cursor !== this._cursors[cursor]) {
            this._previous_cursor = this._current_cursor;
            if (is_defined(this._previous_cursor)) {
                this._previous_cursor.set_to_invisible();
            }
            this._current_cursor = this._cursors[cursor];
            this._current_cursor.set_to_visible();
        }
    },

    _is_current_cursor_type: function(cursor_type) {
        return this._current_cursor.get_text() === cursor_type;
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        this.cursor_wall = new FloatingWall(16, 16, null, null, this.world, false);
        this.cursor_wall.set_to_invisible();
        var cursor_row = this.cursor_wall.add_row(0);
        this._create_cursor(CURSOR_TYPE_HORIZONTAL, cursor_row);
        this._create_cursor(CURSOR_TYPE_VERTICAL, cursor_row);
        this._create_cursor(CURSOR_TYPE_HAND, cursor_row);
        this._create_cursor(CURSOR_TYPE_POINTER, cursor_row);
        this._create_cursor(CURSOR_TYPE_LARGER, cursor_row);
        this._create_cursor(CURSOR_TYPE_MOUSE, cursor_row);
    },

    _create_cursor: function(cursor_type, cursor_row) {
        var c = cursor_row.add_2D_element([0, 1], cursor_ttype, TYPE_ICON);
        c.set_attachment_depth_offset(6);
        c.set_attachment_horizontal_offset(8, null);
        c.set_attachment_vertical_offset(-8, null);
        c.set_to_invisible();

        // TODO : Transparency issues still exist.
        // Needed for fixing transparency issues. This has the cursor be rendered last.
        c.mesh.renderDepth = -1;

        this._cursors[cursor_type] = c;
    }

};