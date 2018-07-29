'use strict';

// Caches files loaded by the FileLoader.
THREE.Cache.enabled = true;

const APPLICATION_NEXUS_LOCAL   = 'nl'; // #pre-process_global_constant
const APPLICATION_QUASAR_PUBLIC = 'qp'; // #pre-process_global_constant

function $_QE() {
    this.__init__();
}

$_QE.prototype = {

    __init__: function() {
        this.UP_VECTOR       = new THREE.Vector3(0, 1, 0);
        this.delta_clock     = new THREE.Clock(false);
        this.delta           = 0;
        this.gui_2d_elements = [];

        // Default settings.
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

    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */
    // Step : 0x0
    ensure_required_features_are_enabled: function() {
        let me = this;

        this.client = new $_QE.prototype.Client();
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
            me.client.show_error('Error ' + EMOJI_ERROR, 'loading assets');
        });
    },

    // Step : 0x2
    _initialize_for_first_render: function() {
        l('Setting up first render!');
        this.manager_renderer = new $_QE.prototype.RendererManager(this.client, this);
        this.client.pre_render_initialize(this.manager_renderer);

        this.player = new $_QE.prototype.Player(this.client, this);
        this.manager_world = new $_QE.prototype.WorldManager(this.player, this.manager_renderer, this.application);

        this.manager_world.initialize_first_world();
        this.manager_renderer.initialize_shaders(this.manager_world.first_world);
        this.manager_world.first_world.create_for_first_render();

        this.manager_input = new $_QE.prototype.InputManager(this.player, this.manager_world);
        this.player.input_manager = this.manager_input;

        this.player.initialize_player_controls();

        this.client._on_window_resize();

        this.manager_world.set_current_world(this.manager_world.first_world);

        // this.engine_loop();
        this.engine_main_loop = this._engine_loop.bind(this);
        this._initialize_render_loop();

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
    _initialize_render_loop: function() {
        this.delta = this.delta_clock.getDelta();

        this.manager_world.update(this.delta);
        this.manager_renderer.render(this.delta);

        this.delta_clock.start();
    },

    _main_loop_logic: function() {
        this.delta = this.delta_clock.getDelta();

        this.client.pre_render();

        this.manager_world.update(this.delta);
        this.manager_renderer.render(this.delta);

        this.client.post_render();

        this.delta_clock.start();
    },

    _engine_loop: function() {
        requestAnimationFrame(this.engine_main_loop);
        if (this.player.current_state !== PLAYER_STATE_PAUSED) {
            this._main_loop_logic();
        }
    },

    reset_delta: function() {
        this.delta_clock.start();
    }
};
