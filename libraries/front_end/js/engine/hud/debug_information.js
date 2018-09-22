'use strict';

$_QE.prototype.GUI2DDebugInformation = function(engine) {
    this.engine           = engine;
    this.player           = this.engine.player;
    this.manager_renderer = this.engine.manager_renderer;

    $_QE.prototype.FeatureColor.call(this, this.engine.COLOR_GREEN, null);
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

    this.add_text_line_to_bottom('fps', this.engine.COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('memory', this.engine.COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('threejs', this.engine.COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('position', this.engine.COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('normal', this.engine.COLOR_CANVAS_GREEN);


    // Debug metrics.
    this._cache_fps         = new $_QE.prototype.EngineFrameCache(false);
    this._cache_memory_used = new $_QE.prototype.EngineFrameCache(true);
    this._cache_memory_size = new $_QE.prototype.EngineFrameCache(true);
    this._cache_geometries  = new $_QE.prototype.EngineFrameCache(false);
    this._cache_textures    = new $_QE.prototype.EngineFrameCache(false);
    this._cache_shaders     = new $_QE.prototype.EngineFrameCache(false);

    this._cache_player_position_x = new $_QE.prototype.EngineFrameCache(true);
    this._cache_player_position_y = new $_QE.prototype.EngineFrameCache(true);
    this._cache_player_position_z = new $_QE.prototype.EngineFrameCache(true);
    this._cache_player_normal_x   = new $_QE.prototype.EngineFrameCache(true);
    this._cache_player_normal_y   = new $_QE.prototype.EngineFrameCache(true);
    this._cache_player_normal_z   = new $_QE.prototype.EngineFrameCache(true);

    // TODO: Add player position + normal.

    this.set_current_frame_count = function(current_frame_count) {
        this._cache_fps.set_value(current_frame_count);
    };

    this._cache_position_and_normal = function() {
        let player_position = this.player.get_position();
        let player_normal   = this.player.get_normal();
        this._cache_player_position_x.set_value(player_position.x);
        this._cache_player_position_y.set_value(player_position.y);
        this._cache_player_position_z.set_value(player_position.z);

        this._cache_player_normal_x.set_value(player_normal.x);
        this._cache_player_normal_y.set_value(player_normal.y);
        this._cache_player_normal_z.set_value(player_normal.z);

        if (this._cache_player_normal_x.has_update || this._cache_player_normal_y.has_update || this._cache_player_normal_z.has_update) {
            this.set_row_contents(0, this._cache_player_normal_x.value_string + ', ' + this._cache_player_normal_y.value_string + ', ' + this._cache_player_normal_z.value_string, QE.COLOR_CANVAS_GREEN);
            this._cache_player_normal_x.has_update = false;
            this._cache_player_normal_y.has_update = false;
            this._cache_player_normal_z.has_update = false;
        }

        if (this._cache_player_position_x.has_update || this._cache_player_position_y.has_update || this._cache_player_position_z.has_update) {
            this.set_row_contents(1, this._cache_player_position_x.value_string + ', ' + this._cache_player_position_y.value_string + ', ' + this._cache_player_position_z.value_string, QE.COLOR_CANVAS_GREEN);
            this._cache_player_position_x.has_update = false;
            this._cache_player_position_y.has_update = false;
            this._cache_player_position_z.has_update = false;
        }
    };

    // TODO: Cache faster references?
    this.content_update = function() {
        this._cache_memory_used.set_value(window.performance.memory.usedJSHeapSize / 1048576);
        this._cache_memory_size.set_value(window.performance.memory.totalJSHeapSize / 1048576);

        this._cache_geometries.set_value('g:' + this.manager_renderer.renderer.info.memory.geometries);
        this._cache_textures.set_value('t:' + this.manager_renderer.renderer.info.memory.textures);
        this._cache_shaders.set_value('s:' + this.manager_renderer.renderer.info.programs.length);

        this._cache_position_and_normal();

        if (this._cache_geometries.has_update || this._cache_textures.has_update || this._cache_shaders.has_update) {
            this.set_row_contents(2, this._cache_geometries.value_string + ', ' + this._cache_textures.value_string + ', ' + this._cache_shaders.value_string, QE.COLOR_CANVAS_GREEN);
            this._cache_geometries.has_update = false;
            this._cache_textures.has_update   = false;
            this._cache_shaders.has_update    = false;
        }
        if (this._cache_fps.has_update) {
            this.set_row_contents(3, this._cache_fps.value_string, QE.COLOR_CANVAS_GREEN);
            this._cache_fps.has_update = false;
        }
        if (this._cache_memory_used.has_update || this._cache_memory_size.has_update) {
            this.set_row_contents(4, '[' + this._cache_memory_used.value_string + '/' + this._cache_memory_size.value_string + ']', QE.COLOR_CANVAS_GREEN);
            this._cache_memory_used.has_update = false;
            this._cache_memory_size.has_update = false;
        }
    };
};
