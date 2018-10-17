'use strict';

$_QE.prototype.GUI2DDebugInformation = function(engine) {
    this.engine           = engine;
    this.player           = this.engine.player;
    this.manager_renderer = this.engine.manager_renderer;

    this.set_colors(this.engine.COLOR_GREEN, null);
    $_QE.prototype.CanvasGUI2D.call(this, GLOBAL_ID_HUD_DEBUG, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);

    this.width = 400;
    // TODO: Make # of rows dynamic.
    //this.height = QE.CANVAS_FONT_SMALLER[1] * 3;
    //this.height = (QE.CANVAS_FONT_SMALLER[1] * 3) + (QE.CANVAS_FONT_SMALLER[2] * 3);
    // TODO: Had to do (rows + 1) for height, figure out why!
    this.height = (QE.CANVAS_FONT_SMALLER[1] * 6) + (QE.CANVAS_FONT_SMALLER[2] * 4);
    //this.initialize_gui(400, 64, 0, 0, null, false, true, QE.CANVAS_FONT_SMALLER);
    this.initialize_gui(400, this.height, 0, 0, null, false, true, this.engine.CANVAS_FONT_SMALLER);
    //this.initialize_gui(400, 128, 0, 0, null, false, true, this.engine.CANVAS_FONT_SMALLER);

    $_QE.prototype.CanvasRenderingTextLines.call(this, 3, false);

    this.add_text_line_to_bottom('fps'     , COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('memory'  , COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('threejs' , COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('position', COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('normal'  , COLOR_CANVAS_GREEN);

    // Debug metrics.
    this._cache_fps             = new $_QE.prototype.DisplayCacheFPS(this, 4);
    this._cache_memory          = new $_QE.prototype.DisplayCacheMemory(this, 3);
    this._cache_position        = new $_QE.prototype.DisplayCachePosition(this, 1, this.player);
    this._cache_normal          = new $_QE.prototype.DisplayCacheNormal(this, 0, this.player);
    this._cache_engine          = new $_QE.prototype.DisplayCacheEngine(this, 2, this.manager_renderer.renderer.info);

    this.set_current_frame_count = function(current_frame_count) {
        this._cache_fps.set(current_frame_count);
    };

    // TODO: Cache faster references?
    this.content_update = function() {
        this._cache_memory.set();
        this._cache_position.set();
        this._cache_normal.set();
        this._cache_engine.set();
    };
};

Object.assign(
    $_NL.prototype.GUI2DDebugInformation.prototype,
    $_QE.prototype.FeatureColor.prototype
);
