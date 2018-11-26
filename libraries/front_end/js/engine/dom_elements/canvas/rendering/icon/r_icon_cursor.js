'use strict';

$_QE.prototype.CanvasRendererCursorIcon = function() {};

Object.assign(
    $_QE.prototype.CanvasRendererCursorIcon.prototype,
    $_QE.prototype.DomCanvasExternal.prototype,
    $_QE.prototype.CanvasRendererIcon.prototype,
    {
        _current_icon : null,

        _initialize_icon_cursor: function() {
            this.set_dimensions(32, 32);
            this.initialize_dom_canvas(GLOBAL_ID_CURSOR_ICON);
            this._set_context();
            this._image_icons = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET).image;
        },

        set_current_icon: function(icon) {
            if (this._current_icon != icon) {
                this._current_icon = icon;
                this.render();
                // TODO: set cursor offsets!
            }
        },

        _set_to_cursor_icon: function() {
            this._cursor_default.hide();
            this.show();
            this.flag_set_off(CURSOR_STATE_DEFAULT);
        },
    }
);

