'use strict';

// Caches files loaded by the FileLoader.
THREE.Cache.enabled = true;
// Other Three.js defaults to adjust.
THREE.Object3D.DefaultMatrixAutoUpdate = false;

const APPLICATION_NEXUS_LOCAL   = 'nl'; // #pre-process_global_constant
const APPLICATION_QUASAR_PUBLIC = 'qp'; // #pre-process_global_constant

function $_QE() {
    this.__init__();
}

$_QE.prototype = {

    __init__: function() {
        $_QE.prototype.EngineFrameCounter.call(this);

        this.UP_VECTOR       = new THREE.Vector3(0, 1, 0);
        this._delta_clock    = new THREE.Clock(false);
        this._delta          = 0;
        this.gui_2d_elements = [];

        // Default settings.
        this.set_number_of_frames_for_physics(90);
        this.set_number_of_frames_for_rendering(60);
        this.set_number_of_frames_for_logic(30);
        this.engine_setting_audio_enabled             = false;
        this.engine_setting_shaders_enabled           = true;
        this.engine_setting_shader_fxaa_enabled       = true;
        this.engine_setting_shader_outline_enabled    = true;
        this.engine_setting_shader_grain_enabled      = true;
        this.engine_setting_shader_transition_enabled = true;
        this.engine_setting_spritesheet_enabled       = true;
    },

    add_gui_2d_element: function(e) {
        this.gui_2d_elements.push(e);
    },

    enter_typing_state: function() {
        this.gui_2d_typing.render();
        this.gui_2d_typing.show();
    },

    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */
    _create_gui_2d: function() {
        this.gui_2d_debug  = new $_QE.prototype.GUI2DDebugInformation();
        this.gui_2d_logs   = new $_QE.prototype.GUI2DMessageLogs(32);
        this.gui_2d_typing = new $_QE.prototype.GUI2DPlayerTypingInput();
    },

    // Step : 0x0
    ensure_required_features_are_enabled: function() {
        let me = this;

        this.client = new $_QE.prototype.Client(this);
        this.client.on_engine_load();
        return new Promise(function(resolve, reject) {
            // Displays error message on pause menu if a required feature is not enabled.
            if (me.client.ensure_required_features_are_enabled()) {
                resolve();
            } else {
                l('Engine failed');
                reject('Engine failed');
            }
        });
    },

    // Step : 0x1
    initialize_engine: function(application) {
        $_QE.prototype.ColorManager.call(this);

        let me              = this;
        this.application    = application;

        // Start the load of asset files.
        this.client.set_sub_title('asset files');
        this.manager_heap   = this.get_heap_manager();
        this.manager_assets = new $_QE.prototype.AssetManager(this);
        this.manager_icons  = new $_QE.prototype.IconManager(this);

        let on_load = this.manager_assets.load_pre_render_assets(this);

        this.client.full_initialize();

        on_load.then(function() {
            l('LOADING FINISHED!');
            me.manager_icons.initialize();
            me.client.set_sub_title('worlds');
            me._initialize_for_first_render();
        }).catch(function(error) {
            l(error);
            l('Error loading asset batch!');
            me.client.show_error('Error ' + EMOJI_ERROR, 'loading assets {' + error + '}');
        });
    },

    // Step : 0x2
    _initialize_for_first_render: function() {
        //l('Setting up first render!');
        this.manager_renderer = new $_QE.prototype.RendererManager(this.client, this);
        this.client.pre_render_initialize(this.manager_renderer);

        this.player = new $_QE.prototype.Player(this.client, this);
        this.manager_world = new $_QE.prototype.WorldManager(this.player, this.manager_renderer, this.application);

        this.manager_world.initialize_first_world();
        this.manager_renderer.initialize_shaders(this.manager_world.first_world);
        this.manager_world.first_world.create_for_first_render();
        this._create_gui_2d();

        this.manager_input = new $_QE.prototype.InputManager(this);

        this.player.initialize_player_controls();

        this.client._on_window_resize();

        this.manager_world.set_current_world(this.manager_world.first_world);

        this.engine_main_loop = this._engine_loop.bind(this);

        // Perform one psedu engine loop.
        this.manager_world.physics(this._engine_time_per_frame_physics);
        this.manager_world.update(this._engine_time_per_frame_physics);
        this.manager_renderer.render(this._engine_time_per_frame_physics);
        //

        this.player.set_state(PLAYER_STATE_PAUSED);
        this.client.show_paused();
        this.client.set_debug_mode(DEBUG_MODE_FPS);

        // Connect to websockets.
        this.manager_web_sockets = new $_QE.prototype.WebSocketManager(this);

        this.application.engine_started();

        this.engine_main_loop();
    },

    /*___       __          ___          __   __       ___  ___          __   __   __
     |__  |\ | / _` | |\ | |__     |  | |__) |  \  /\   |  |__     |    /  \ /  \ |__)
     |___ | \| \__> | | \| |___    \__/ |    |__/ /~~\  |  |___    |___ \__/ \__/ |    */
    _engine_loop: function() {
        requestAnimationFrame(this.engine_main_loop);
        if (this.player.current_state !== PLAYER_STATE_PAUSED) {
            this._delta = this._delta_clock.getDelta();
            this._engine_elapsed_time_second  += this._delta;
            this._engine_elapsed_time_physics += this._delta;
            this._engine_elapsed_time_logic   += this._delta;
            this._engine_elapsed_time_render  += this._delta;

            if (this._engine_elapsed_time_second >= 1.0) {
                // Reset.
                this._frames_passed = Math.floor(this._engine_elapsed_time_second);

                this._engine_elapsed_time_second -= this._frames_passed;
                // Debug metrics.
                this._cache_fps.set_value(this._engine_frame_counter_render);
                this._cache_memory_used.set_value(window.performance.memory.usedJSHeapSize);
                this._cache_memory_size.set_value(window.performance.memory.totalJSHeapSize);
                this._cache_geometries.set_value('g:' + this.manager_renderer.renderer.info.memory.geometries);
                this._cache_geometries.set_value('t:' + this.manager_renderer.renderer.info.memory.textures);
                this._cache_geometries.set_value('s:' + this.manager_renderer.renderer.info.programs.length);
                if (this._cache_fps.has_update) {
                    this.gui_2d_debug.set_row_contents(2, this._cache_fps.value_string, QE.COLOR_CANVAS_GREEN);
                    this._cache_fps.has_update = false;
                }
                if (this._cache_memory_used.has_update || this._cache_memory_size.has_update) {
                    this.gui_2d_debug.set_row_contents(1, '[' + this._cache_memory_used.value_string + '/' + this._cache_memory_size.value_string + ']', QE.COLOR_CANVAS_GREEN);
                    this._cache_memory_used.has_update = false;
                    this._cache_memory_size.has_update = false;
                }
                if (this._cache_geometries.has_update || this._cache_textures.has_update || this._cache_shaders.has_update) {
                    this.gui_2d_debug.set_row_contents(0, this._cache_geometries.value_string + ', ' + this._cache_textures.value_string + ', ' + this._cache_shaders.value_string, QE.COLOR_CANVAS_GREEN);
                    this._cache_geometries.has_update = false;
                    this._cache_textures.has_update   = false;
                    this._cache_shaders.has_update    = false;
                }
                this.gui_2d_debug.update();
                this._engine_frame_counter_render = 0;
            }

            if (this._engine_elapsed_time_physics >= this._engine_time_per_frame_physics) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._engine_elapsed_time_physics / this._engine_time_per_frame_physics);

                this._engine_elapsed_time_physics -= this._frames_passed * this._engine_time_per_frame_physics;
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.physics(this._engine_time_per_frame_physics);
                    this._frame_iteration++;
                }
            }

            if (this._engine_elapsed_time_logic >= this._engine_time_per_frame_logic) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._engine_elapsed_time_logic / this._engine_time_per_frame_logic);

                this._engine_elapsed_time_logic -= this._frames_passed * this._engine_time_per_frame_logic;
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.update(this._engine_time_per_frame_logic);
                    this._frame_iteration++;
                }
            }

            if (this._engine_elapsed_time_render >= this._engine_time_per_frame_render) {
                // Reset.
                this._frames_passed = Math.floor(this._engine_elapsed_time_render / this._engine_time_per_frame_render);

                this._engine_elapsed_time_render -= this._frames_passed * this._engine_time_per_frame_render;
                this.manager_renderer.render(this._frames_passed * this._engine_time_per_frame_render);
                this._engine_frame_counter_render++;
            }
        }
        this._delta_clock.start();
    },
};
