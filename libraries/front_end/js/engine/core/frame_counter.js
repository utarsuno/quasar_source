'use strict';

$_QE.prototype.EngineFrameCache = function(is_float) {
    this.is_float     = is_float;
    this.value        = 0.0;
    this.value_string = '';

    this._cache_string = '';

    this.has_update = false;

    this.set_value = function(v) {
        if (this.value !== v) {
            this.value = v;
            if (!this.is_float) {
                this._cache_string = this.value.toString();
            } else {
                this._cache_string = (this.value / 1048576).toFixed(2).toString();
            }
            if (this.value_string !== this._cache_string) {
                this.value_string = this._cache_string;
                this.has_update = true;
            }
        }
    };
};

$_QE.prototype.EngineFrameCounter = function() {

    this._engine_frame_counter_render = 0;

    this._engine_elapsed_time_physics = 0.0;
    this._engine_elapsed_time_render  = 0.0;
    this._engine_elapsed_time_logic   = 0.0;
    this._engine_elapsed_time_second  = 0.0;

    // cache
    this._frames_passed   = 0;
    this._frame_iteration = 0;

    this._cache_fps         = new $_QE.prototype.EngineFrameCache(false);
    this._cache_memory_used = new $_QE.prototype.EngineFrameCache(true);
    this._cache_memory_size = new $_QE.prototype.EngineFrameCache(true);
    this._cache_geometries  = new $_QE.prototype.EngineFrameCache(false);
    this._cache_textures    = new $_QE.prototype.EngineFrameCache(false);
    this._cache_shaders     = new $_QE.prototype.EngineFrameCache(false);

    this.on_pause = function() {
        this.client.show_paused();

        this._engine_elapsed_time_physics  = 0.0;
        this._engine_elapsed_time_render   = 0.0;
        this._engine_elapsed_time_logic    = 0.0;
        this._engine_elapsed_time_second   = 0.0;

        this._engine_frame_counter_render  = 0;
    };

    this.set_number_of_frames_for_physics = function(fps) {
        this._engine_time_per_frame_physics = 1.0 / fps;
    };

    this.set_number_of_frames_for_rendering = function(fps) {
        this._engine_time_per_frame_render = 1.0 / fps;
    };

    this.set_number_of_frames_for_logic = function(fps) {
        this._engine_time_per_frame_logic = 1.0 / fps;
    };
};