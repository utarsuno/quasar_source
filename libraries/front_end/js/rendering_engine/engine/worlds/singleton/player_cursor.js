'use strict';

$_QE.prototype.PlayerCursor = function() {

    this.currently_attached_to = null;
    this._current_cursor       = null;
    this._currently_engaged    = false;

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
        //this.cursor.set_to_visible();
    };

    this.update = function() {

    };

    this.update_position = function(p) {
        let normal = this.currently_attached_to.get_normal();

        //this.cursor.set_position(p.x, p.y, p.z, false);
        this.cursor.set_normal(normal.x, normal.y, normal.z, false);
        this.cursor.set_position_for_singleton(p.x, p.y, p.z);
        //this.cursor.set_normal(normal.x, normal.y, normal.z, false);
        this.cursor.refresh_position_and_look_at();
    };

    this.detach = function() {
        if (this._current_cursor !== null) {
            this.cursor.set_to_invisible();
        }

        this.currently_attached_to = null;
        this._current_cursor       = null;

        this._center_cursor.show();
    };

    this._set_current_cursor = function(cursor) {
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
                this.cursor.set_attachment_horizontal_offset(7, null);
                break;
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
        this.cursor = new $_QE.prototype.FloatingIcon(world, ICON_CLICK, 16);
        this.cursor.set_to_invisible();
        this.cursor.set_to_manual_positioning();
        this.cursor.set_to_singleton();
        this.cursor.set_attachment_depth_offset(6);
        this._center_cursor = new $_QE.prototype.DomElement('center_cursor', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV, false);
    };

};
