'use strict';

Object.assign(
    $_QE.prototype,
    {
        _initialize_background: function() {
            this._shader_background = QE.manager_assets.get_asset(ASSET_SHADER_MATERIAL_BACKGROUND);
        },

        _update_background: function() {
            this._shader_background.set_aspect(this.get_aspect_ratio());
            this._shader_background.set_grain_scale(this.get_grain_scale());
        },

        get_grain_scale: function() {
            return 1.5 / Math.min(this._cachei[QECACHEI_WIDTH_INNER], this._cachei[QECACHEI_HEIGHT_INNER]);
        },
    }
);

