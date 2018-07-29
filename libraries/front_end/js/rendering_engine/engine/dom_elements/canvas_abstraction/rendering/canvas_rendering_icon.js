'use strict';

$_QE.prototype.CanvasRenderingIcon = function() {

    this._image_icons = QE.manager_assets.get_asset(ASSET_TEXTURE_SPRITE_SHEET).image;
    this._icon_to_render = ICON_ARROW;

    this.render = function() {
        if (this._icon_to_render !== this._current_icon) {
            this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);
            this.context.drawImage(this._image_icons, this._current_icon * 64, 0, 64, 64, 0, 0, this._canvas_width, this._canvas_height);
            this._icon_to_render = this._current_icon;
        }
    };
};
