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

    engage: function() {
        this._currently_engaged = true;

        // Save the initial position at the engage.
        this._previous_position = this.cursor_wall.get_position();

        this._horizontal_distance_to_player = this.currently_attached_to.get_horizontal_distance_to_center(this._previous_position.x, this._previous_position.z);
    },

    disengage: function() {
        this._currently_engaged = false;
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

    // TODO : update
    update: function() {
        if (this._currently_engaged) {

            l('TODO : Currently engaged cursor function!');

            var player_parametric_equation = get_parametric_line_equation(CURRENT_PLAYER.get_position(), CURRENT_PLAYER.get_direction());
            var plane_parametric_equation = get_parametric_plane_equation(this.currently_attached_to.get_position(), this.currently_attached_to.get_normal());

            var current_position = get_line_intersection_on_infinite_plane(player_parametric_equation, plane_parametric_equation);

            l('OFFSET IS :');
            l(this._previous_position.x - current_position[0]);
            l(this._previous_position.y - current_position[1]);
            l(this._previous_position.z - current_position[2]);


        } else {
            if (is_defined(this.currently_attached_to)) {
                if (this.currently_attached_to.scalable) {
                    this._get_scalable_cursor_needed();
                }
            }
        }
    },

    // TODO : Remove
    update_OLD: function() {
        if (this.cursor_needed_from_floating_walls || this.cursor_needed_from_interactive_objects) {
            this.current_cursor.visible = true;
            this.cursor_needed_from_floating_walls = false;
            this.cursor_needed_from_interactive_objects = false;
        } else {
            if (!this.engaged) {
                this.current_cursor.visible = false;
            }
        }

        if (this.engaged) {
            if (is_defined(this.current_floating_wall)) {
                this.current_floating_wall.perform_action(this.current_cursor.userData.name);
            }
        }

        // TODO : Update the late positions here.
    },

    _get_scalable_cursor_needed: function() {
        var h = this.currently_attached_to.height;
        var w = this.currently_attached_to.width;

        var cursor_position = this.cursor_wall.get_position();

        var vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - cursor_position.y ) / h;
        var horizontal_percentage = this.currently_attached_to.get_horizontal_distance_to_center(cursor_position.x, cursor_position.z) / w;

        var scroll_vertical   = false;
        var scroll_horizontal = false;

        //l(vertical_percentage);
        //l(horizontal_percentage);

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

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        this.cursor_wall = new FloatingWall(16, 16, null, null, this.world, false);
        this.cursor_wall.set_to_invisible();
        this._create_cursor(CURSOR_TYPE_HORIZONTAL);
        this._create_cursor(CURSOR_TYPE_VERTICAL);
        this._create_cursor(CURSOR_TYPE_HAND);
        this._create_cursor(CURSOR_TYPE_POINTER);
        this._create_cursor(CURSOR_TYPE_LARGER);
        this._create_cursor(CURSOR_TYPE_MOUSE);
    },

    _create_cursor: function(cursor_type) {
        var c = this.cursor_wall.add_row_2D_text([0, 1], 0, cursor_type, TYPE_ICON);
        c.set_attachment_depth_offset(1);
        c.set_attachment_horizontal_offset(8, 0);
        c.set_attachment_vertical_offset(-8, 0);
        c.set_to_invisible();

        // TODO : Transparency issues still exist.
        // Needed for fixing transparency issues. This has the cursor be rendered last.
        c.mesh.renderDepth = -1;

        this._cursors[cursor_type] = c;
    }

};