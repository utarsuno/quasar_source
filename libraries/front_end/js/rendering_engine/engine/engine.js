'use strict';

// Caches files loaded by the FileLoader.
THREE.Cache.enabled = true;

let QE;

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
    },

    add_gui_2d_element: function(e) {
        this.gui_2d_elements.push(e);
    },

    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */
    check_if_required_features_are_supported: function () {
        this.client = new $_QE.prototype.Client();
        this.client.initialize_state_canvas_support();
        this.client.initialize_state_webgl_support();
        this.client.initialize_pause_menu();
    },

    are_required_features_supported: function() {
        if (!(this.client.state_is_webgl_enabled && this.client.state_is_canvas_enabled)) {
            console.log('ERROR: WebGL or Canvas not supported!');
            return false;
        }
        return true;
    },

    initialize_and_set_application: function(application) {
        this.application = application;

        this.engine_setting_audio_enabled          = this.application.engine_setting_audio_enabled;
        this.engine_setting_shaders_enabled        = this.application.engine_setting_shaders_enabled;
        this.engine_setting_shader_fxaa_enabled    = this.application.engine_setting_shader_fxaa_enabled;
        this.engine_setting_shader_outline_enabled = this.application.engine_setting_shader_outline_enabled;
        this.engine_setting_shader_grain_enabled   = this.application.engine_setting_shader_grain_enabled;

        // First, start the loading of initial-render-required assets.
        this.manager_assets      = new $_QE.prototype.AssetManager(this);
        this.manager_textures    = new $_QE.prototype.TextureManager(this);
        this.manager_shaders     = new $_QE.prototype.ShaderManager(this);
        this.manager_spritesheet = new $_QE.prototype.SpritesheetManager(this);

        this.manager_heap        = this.get_heap_manager();

        this.client.set_pause_menu_text_and_sub_text('Loading', 'asset files...');

        // Setting the engine default initial-render-required assets.
        this.manager_assets.add_initial_render_required_asset(ASSET_REQUIRED_SPRITESHEET);
        this.manager_assets.add_initial_render_required_asset(ASSET_REQUIRED_FILM_SHADER);
        this.manager_assets.load_required_initial_render_assets(this.initial_required_assets_loaded.bind(this), this.manager_shaders, this.manager_textures);
    },

    initial_required_assets_loaded: function() {
        l('Initial required assets finished loading!');

        this.client.set_pause_menu_text_and_sub_text('Creating', 'world...');

        this.manager_renderer = new $_QE.prototype.RendererManager(this.client, this);
        this.client.pre_render_initialize(this.manager_renderer);

        this.player = new $_QE.prototype.Player(this.client, this);
        this.manager_world = new $_QE.prototype.WorldManager(this.player, this.manager_renderer, this.application);

        this.manager_world.initialize_first_world();

        this.manager_input = new $_QE.prototype.InputManager(this.player, this.manager_world);
        this.player.input_manager = this.manager_input;

        this.manager_renderer.initialize_shaders(this.manager_world.first_world);

        this.player.initialize_player_controls();

        this.client._on_window_resize();

        this.manager_world.set_current_world(this.manager_world.first_world);

        // this.engine_loop();
        this.engine_main_loop = this._engine_loop.bind(this);
        this._main_loop_logic();

        this.player.set_state(PLAYER_STATE_PAUSED);
        this.client.set_pause_menu_text_and_sub_text('Paused', 'double click to resume');

        // Connect to websockets.
        this.manager_web_sockets = new $_QE.prototype.WebSocketManager(this);

        this.application.engine_started();

        this.engine_main_loop();
    },

    /*___       __          ___          __   __       ___  ___          __   __   __
     |__  |\ | / _` | |\ | |__     |  | |__) |  \  /\   |  |__     |    /  \ /  \ |__)
     |___ | \| \__> | | \| |___    \__/ |    |__/ /~~\  |  |___    |___ \__/ \__/ |    */
    _main_loop_logic: function() {
        this.delta = this.delta_clock.getDelta();

        this.client.pre_render();

        //this.client.update();
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


/*
// Engine starts here!
window.onload = function() {
    QE = new $_QE();


    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        MANAGER_MANAGER.set_quasar_main_object(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER, MANAGER_MANAGER);

        MANAGER_MANAGER.initial_asset_loading_start(MANAGER_MANAGER.quasar_main_object);
    }

};




    get_window_properties: function() {
        this.window_width  = window.innerWidth;
        this.window_height = window.innerHeight;
        this.aspect_ratio  = this.window_width / this.window_height;
        CURRENT_CLIENT.height_re_sized(this.window_height);
    },
*/
