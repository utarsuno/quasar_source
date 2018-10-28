'use strict';

Object.assign(
    $_QE.prototype.PlayerCursor.prototype,
    {
        _current_icon : null,
        _player_offset: 1400,

        _need_move_icon: function() {
            return this.attached_to.get_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK) && this.attached_to.get_flag(EFLAG_MOUSE_MOVEABLE);
        },

        _set_needed_on_attach_icon: function() {
            if (this.attached_to.get_flag(EFLAG_CLICKABLE) && !this.attached_to.get_flag(EFLAG_TYPING)) {
                this.set_current_icon(ASSET_ICON_CLICK);
            } else if (this.attached_to.get_flag(EFLAG_TYPING)) {
                this.set_current_icon(ASSET_ICON_WRITTING);
            } else if (this.attached_to.get_flag(EFLAG_MOUSE_SCALEABLE)) {
                //if (this.dx < .02 && this._dx > .98 && this._dy < .02 && this._dy > .98) {
                this.set_current_icon(ASSET_ICON_EXPAND);
            } else if (this.attached_to.get_flag(EFLAG_MOUSE_MOVEABLE)) {

                this.set_current_icon(ASSET_ICON_DRAG);
            } else {
                QE.log_warning('Missing cursor state!');
            }
        },

        _set_needed_on_engage_icon: function() {
            if (this.attached_to.get_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK) && this.attached_to.get_flag(EFLAG_MOUSE_MOVEABLE)) {

            }
        },

        engage: function() {
            this.set_flag_on(CURSOR_FLAG_ENGAGED);

            //this._current_icon === ASSET_ICON_DRAG
            if (this._need_move_icon()) {
                QE.player.set_in_front_of_object(this.attached_to, this._player_offset);
                QE.set_flag_on(ENGINE_STATE_MOUSE_Y_DISABLED);
                this.set_flag_on(CURSOR_FLAG_MOVING);

                this.set_current_icon(ASSET_ICON_DRAG);
            } else {
                // TODO:
                l('TODO: Handle other cases.');
                this.hide();
            }
        },

        disengage: function() {
            this.set_flag_off(CURSOR_FLAG_ENGAGED);
            this.set_flag_off(CURSOR_FLAG_MOVING);
            this.set_flag_off(CURSOR_FLAG_SCALING);
            QE.set_flag_off(ENGINE_STATE_MOUSE_Y_DISABLED);
            this.show();

            if (this.attached_to != null) {
                this._set_needed_on_attach_icon();
            }
        },

        set_current_icon: function(icon) {
            if (this._current_icon != icon) {
                this._current_icon = icon;
                this.render();
                // TODO: set cursor offsets!
            }
        },

        _initialize_icon_cursor: function() {
            this.set_dimensions(32, 32);
            this._set_canvas_as_reference(GLOBAL_ID_CURSOR_ICON);
            this._initialize_as_hud_from_reference();

            this._image_icons    = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET).image;
            this._icon_to_render = ASSET_ICON_ARROW;
        },

        _set_to_cursor_icon: function() {
            this._cursor_default.hide();
            this.show();
            this.set_flag_off(CURSOR_FLAG_DEFAULT);
        },

        render: function() {
            if (this._icon_to_render != this._current_icon) {
                // TODO: Utilize canvas rendering abstraction!
                this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);
                this.context.drawImage(this._image_icons, this._current_icon * 64, 0, 64, 64, 0, 0, this._canvas_width, this._canvas_height);
                this._icon_to_render = this._current_icon;
            }
        },

        on_wheel_event: function(delta) {
            if (delta == 1) {
                this._player_offset *= 1.025;
            } else {
                this._player_offset *= 0.975;
            }
        },
    }
);
