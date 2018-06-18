'use strict';

$_QE.prototype.PlayerCursor = function() {
    this.currently_attached_to = null;
    this._current_cursor = null;
    this._currently_engaged = false;
    this._center_cursor = new $_QE.prototype.DomElement('center_cursor');

    this.wheel_event = function(delta) {
        switch (delta) {
        case 1:
            this._horizontal_distance_to_player *= 1.1;
            break;
        case -1:
            this._horizontal_distance_to_player *= 0.9;
            break;
        }
    };

    this.engage = function() {
        this._currently_engaged = true;

        let h = this.currently_attached_to.height;

        let cursor_position = this.cursor.get_position();

        this._previous_vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - cursor_position.y ) / h;

        // Save the initial position at the engage.
        this._previous_y = cursor_position.y;

        let pp = this.player.get_position();

        this._horizontal_distance_to_player = this.currently_attached_to.get_horizontal_distance_to_center(pp.x, pp.z);

        // TODO : TEMPORARY MEASURE.
        //this._current_cursor.set_to_invisible();
        if (this.created) {
            this.cursor.set_to_invisible();
        }
    };

    this.disengage = function() {
        this._currently_engaged = false;

        // TODO : TEMPORARY MEASURE.
        //this._current_cursor.set_to_visible();
        if (this.created) {
            this.cursor.set_to_visible();
        }

        let plane_current_position = this.currently_attached_to.get_position();
        let player_parametric_equation = get_parametric_line_equation(this.player.get_position(), this.player.get_direction());
        let plane_parametric_equation = get_parametric_plane_equation(plane_current_position, this.currently_attached_to.get_normal());
        let current_position = get_line_intersection_on_infinite_plane(player_parametric_equation, plane_parametric_equation);

        if (this._is_current_cursor_type(ICON_VERTICAL)) {
            let h = this.currently_attached_to.height;

            let current_vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - current_position[1] ) / h;

            // TODO : FIX HEIGHT CHANGES FROM THE BOTTOM!!!!

            current_vertical_percentage *= 2;
            current_vertical_percentage *= -1;
            this.currently_attached_to.update_height(1 + current_vertical_percentage);
            this.currently_attached_to.refresh_position_and_look_at();

        } else if (this._is_current_cursor_type(ICON_HORIZONTAL)) {

            let w = this.currently_attached_to.width;

            let current_horizontal_percentage = this.currently_attached_to.get_horizontal_distance_to_center(current_position[0], current_position[2]) / w;

            current_horizontal_percentage = 0.5 - current_horizontal_percentage;
            current_horizontal_percentage *= 2;
            current_horizontal_percentage *= -1;

            //current_vertical_percentage *= -1;
            this.currently_attached_to.update_width(1 + current_horizontal_percentage);
            this.currently_attached_to.refresh_position_and_look_at();
        }

    };

    this.attach = function(object_to_attach_to) {
        this.currently_attached_to = object_to_attach_to;

        // For floating elements.
        if (is_defined(this.currently_attached_to.is_clickable)) {
            if (this.currently_attached_to.is_clickable) {
                this._set_current_cursor(ICON_CLICK);
            } else if (this.currently_attached_to.is_interactive) {
                this._set_current_cursor(ICON_WRITING);
            }
        } else {
            if (this.currently_attached_to.scalable) {
                this._get_scalable_cursor_needed();
            } else {
                this._set_current_cursor(ICON_CURSOR);
            }
        }

        this._center_cursor.hide();
    };

    this.detach = function() {
        if (this.created) {
            if (is_defined(this._current_cursor)) {
                this.cursor.set_to_invisible();
            }
        }

        this.currently_attached_to = null;
        this._current_cursor       = null;

        this._center_cursor.show();
    };

    this.update_position = function(p) {
        let normal = this.currently_attached_to.get_normal();

        //this.cursor.set_position(p.x, p.y, p.z, false);
        this.cursor.set_normal(normal.x, normal.y, normal.z, false);
        this.cursor.set_position_for_singleton(p.x, p.y, p.z);
        //this.cursor.set_normal(normal.x, normal.y, normal.z, false);
        this.cursor.refresh_position_and_look_at();
    };

    this.update = function() {
        if (this._currently_engaged) {

            let plane_current_position = this.currently_attached_to.get_position();

            let player_parametric_equation = get_parametric_line_equation(this.player.get_position(), this.player.get_direction());
            let plane_parametric_equation = get_parametric_plane_equation(plane_current_position, this.currently_attached_to.get_normal());

            let current_position = get_line_intersection_on_infinite_plane(player_parametric_equation, plane_parametric_equation);

            if (this._is_current_cursor_type(ICON_DRAG)) {
                let pp = this.player.get_position();
                let pn = this.player.get_direction();

                let new_x_position = pp.x + pn.x * this._horizontal_distance_to_player;
                let new_z_position = pp.z + pn.z * this._horizontal_distance_to_player;

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
    };

    this._get_scalable_cursor_needed = function() {
        let exit_out = false;
        if (is_defined(this.currently_attached_to.only_moveable)) {
            if (this.currently_attached_to.only_moveable) {
                this._set_current_cursor(ICON_DRAG);
                exit_out = true;
            }
        }

        if (exit_out) {
            return;
        }

        let h = this.currently_attached_to.height;
        let w = this.currently_attached_to.width;

        let cursor_position = this.cursor.get_position();

        let vertical_percentage = ((this.currently_attached_to.object3D.position.y + h / 2) - cursor_position.y ) / h;
        let horizontal_percentage = this.currently_attached_to.get_horizontal_distance_to_center(cursor_position.x, cursor_position.z) / w;

        let scroll_vertical   = false;
        let scroll_horizontal = false;

        if (vertical_percentage < 0.03 || vertical_percentage > 0.97) {
            scroll_vertical = true;
        }

        if (horizontal_percentage > .47) {
            scroll_horizontal = true;
        }

        if (scroll_horizontal && scroll_vertical) {
            this._set_current_cursor(ICON_EXPAND);
        } else if (scroll_vertical) {
            this._set_current_cursor(ICON_VERTICAL);
        } else if (scroll_horizontal) {
            this._set_current_cursor(ICON_HORIZONTAL);
        } else {
            this._set_current_cursor(ICON_DRAG);
        }
    };

    this._set_current_cursor = function(cursor) {
        if (this.created) {
            if (this._current_cursor !== cursor) {
                this._current_cursor = cursor;
                this.cursor.switch_icon(cursor);
                this.cursor.set_to_visible();

                switch (cursor) {
                case ICON_CLICK:
                    this.cursor.set_attachment_vertical_offset(-7, null);
                    this.cursor.set_attachment_horizontal_offset(1, null);
                    break;
                case ICON_WRITING:
                    this.cursor.set_attachment_vertical_offset(8, null);
                    this.cursor.set_attachment_horizontal_offset(7);
                    break;
                }
            }
        }
    };

    this._is_current_cursor_type = function(cursor_type) {
        return this._current_cursor === cursor_type;
    };

    this.switch_to_new_world = function(old_world, new_world) {
        this.cursor.switch_worlds(old_world, new_world);
        this.detach();
    };

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    this.create = function(world, player) {
        this.player = player;
        this.cursor = new FloatingIcon(world, ICON_CLICK, 16);
        this.cursor.set_to_invisible();
        this.cursor.set_to_manual_positioning();
        this.cursor.set_to_singleton();
        this.cursor.set_attachment_depth_offset(6);
        this.created = true;
    };
};