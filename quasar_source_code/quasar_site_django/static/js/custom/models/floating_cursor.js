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
    },

    attach: function(object_to_attach_to) {
        this.currently_attached_to = object_to_attach_to;

        if (this.currently_attached_to.type === TYPE_BUTTON || this.currently_attached_to.type === TYPE_CHECK_BOX) {
            this._current_cursor = this._cursors[CURSOR_TYPE_HAND];
        } else if (this.currently_attached_to.scalable) {

            var h = this.currently_attached_to.height;
            var w = this.currently_attached_to.width;

            var cursor_position = this.cursor_wall.get_position();

            var vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - cursor_position.y ) / h;
            var horizontal_percentage = this.currently_attached_to.get_horizontal_distance_to_center(cursor_position.x, cursor_position.z) / w;

            var scroll_vertical   = false;
            var scroll_horizontal = false;

            if (vertical_percentage < 0.02 || vertical_percentage > 0.98) {
                scroll_vertical = true;
            }
            if (horizontal_percentage > .48) {
                scroll_horizontal = true;
            }

            if (scroll_horizontal && scroll_vertical) {
                this._current_cursor = this._cursors[CURSOR_TYPE_LARGER];
            } else if (scroll_vertical) {
                this._current_cursor = this._cursors[CURSOR_TYPE_VERTICAL];
            } else if (scroll_horizontal) {
                this._current_cursor = this._cursors[CURSOR_TYPE_HORIZONTAL];
            } else {
                this._current_cursor = this._cursors[CURSOR_TYPE_MOUSE];
            }

        } else {
            this._current_cursor = this._cursors[CURSOR_TYPE_POINTER];
        }

        this._current_cursor.set_to_visible();
    },

    detach: function() {
        this.currently_attached_to = null;
        this._current_cursor.set_to_invisible();
    },

    update_position: function(p) {
        //l('TODO : Update cursor position!');
        //l(p.point);

        var normal = this.currently_attached_to.get_normal();

        this.cursor_wall.set_position(p.x, p.y, p.z, false);
        this.cursor_wall.set_normal(normal.x, normal.y, normal.z, false);
        this.cursor_wall.refresh_position_and_look_at();
    },




    ////////
    engage: function() {
        this.engaged = true;
        CURRENT_PLAYER.engage();
        CURRENT_PLAYER.enable_controls();
    },

    disengage: function() {
        // TODO : temp fix.
        if (this.engaged) {
            this.engaged = false;
            CURRENT_PLAYER.disengage();
            if (is_defined(this.current_floating_wall)) {
                this.current_floating_wall.cursor_action_disengaged();
                this.current_floating_wall = null;
            }
        }
    },

    is_currently_visible: function() {
        return this.current_cursor.visible;
    },

    set_data: function(data) {
        this.set_cursor(data[1]);
        this.current_floating_wall = data[2];
        this.current_floating_wall.currently_engaged_with_cursor = true;
        this.cursor_needed_from_floating_walls = true;
        this.set_position(data[0]);
    },

    update: function() {
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

    set_cursor: function(cursor_type) {
        if (this.cursors.hasOwnProperty(cursor_type)) {
            if (this.cursors[cursor_type] !== this.current_cursor) {
                this.previous_cursor = this.current_cursor;
                this.previous_cursor.visible = false;
                this.current_cursor = this.cursors[cursor_type];
            }
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

        // Needed for fixing transparency issues. This has the cursor be rendered last.
        c.mesh.renderDepth = -1;

        this._cursors[cursor_type] = c;
    }

};