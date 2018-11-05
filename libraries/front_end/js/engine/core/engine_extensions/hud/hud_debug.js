'use strict';

$_QE.prototype.HUDDebug = function() {};

Object.assign(
    $_QE.prototype.HUDDebug.prototype,
    $_QE.prototype.HUDElement.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    {
        // Debug metrics.
        _cache_fps     : null,
        _cache_memory  : null,
        _cache_position: null,
        _cache_normal  : null,
        _cache_engine  : null,

        //
        engine: null,

        __init__: function(engine) {
            this.engine = engine;

            this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT);

            this.initialize_hud_element(5, 400, QE.FONT_ARIAL_12, GLOBAL_ID_HUD_DEBUG);

            this._cache_fps      = new $_QE.prototype.DisplayCacheFPS(this.rows[4]);
            this._cache_engine   = new $_QE.prototype.DisplayCacheEngine(this, this.rows[3]);
            this._cache_memory   = new $_QE.prototype.DisplayCacheMemory(this.rows[2]);
            this._cache_position = new $_QE.prototype.DisplayCachePosition(this, this.rows[1]);
            this._cache_normal   = new $_QE.prototype.DisplayCacheNormal(this, this.rows[0]);

            return this;
        },

        set_current_frame_count: function(current_frame_count) {
            this._cache_fps.set(current_frame_count);
        },

        content_update: function() {
            this._cache_memory.set();
            this._cache_position.set();
            this._cache_normal.set();
            this._cache_engine.set();
        },
    }
);
