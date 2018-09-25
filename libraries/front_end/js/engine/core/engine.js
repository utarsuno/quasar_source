'use strict';

// Caches files loaded by the FileLoader.
THREE.Cache.enabled = true;
// Other Three.js defaults to adjust.
THREE.Object3D.DefaultMatrixAutoUpdate = false;

function $_QE() {
    this.__init__();
}

$_QE.prototype = {

    __init__: function() {
        $_QE.prototype.EngineFrameCounter.call(this);

        this.UP_VECTOR       = new THREE.Vector3(0, 1, 0);
        this._delta_clock    = new THREE.Clock(false);
        this._delta          = 0;

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

    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */

    // Step : 0x0
    ensure_required_features_are_enabled: function() {
        let me           = this;
        this.manager_hud = new $_QE.prototype.HUDManager(this);
        this.client      = new $_QE.prototype.Client(this);
        $_QE.prototype.ErrorManager.call(this);

        return new Promise(function(resolve, reject) {
            if (me.client.are_required_features_enabled()) {
                resolve();
            } else {
                reject('Engine failed to load! Missing features {' + me.client.get_names_of_required_features_not_enabled() + '}');
            }
        });
    },

    // Step : 0x1
    initialize_engine: function(application) {
        $_QE.prototype.ColorManager.call(this);

        let me              = this;
        this.application    = application;

        // Start the load of asset files.
        this.manager_hud.set_sub_title('asset files');
        this.manager_heap   = this.get_heap_manager();
        this.manager_assets = new $_QE.prototype.AssetManager(this);
        this.manager_icons  = new $_QE.prototype.IconManager(this);

        let on_load = this.manager_assets.load_pre_render_assets(this);

        this.client.full_initialize();

        on_load.then(function() {
            l('LOADING FINISHED!');
            me.manager_icons.initialize();
            me.manager_hud.set_sub_title('worlds');
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

        this.player        = new $_QE.prototype.Player(this.client, this);
        this.manager_world = new $_QE.prototype.WorldManager(this.player, this.manager_renderer, this.application, this);

        this.manager_world.initialize_first_world();
        this.manager_renderer.initialize_shaders(this.manager_world.first_world);
        this.manager_world.first_world.create_for_first_render();

        this.manager_hud.initialize();

        this.manager_input = new $_QE.prototype.InputManager(this);

        this.player.initialize_player_controls();

        this.client._on_window_resize();

        this.manager_world.set_current_world(this.manager_world.first_world);

        this.engine_main_loop = this._engine_loop.bind(this);

        // Perform one psedu engine loop.
        this.manager_world.physics(this._engine_time_per_frame_physics);
        this.manager_world.update(this._engine_time_per_frame_physics);
        this.manager_renderer.render(this._engine_time_per_frame_physics);
        //this.manager_hud.update(this._engine_time_per_frame_physics);
        //

        this.player.set_state(PLAYER_STATE_PAUSED);
        this.manager_hud.show_paused();

        // Connect to websockets.
        this.manager_web_sockets = new $_QE.prototype.WebSocketManager(this);

        this.application.engine_started();

        //this.manager_world.
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

                this.manager_hud.hud_debug.set_current_frame_count(this._engine_frame_counter_render);

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

                this.manager_hud.update();
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
