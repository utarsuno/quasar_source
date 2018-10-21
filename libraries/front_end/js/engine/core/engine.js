'use strict';

// Caches files loaded by the FileLoader.
THREE.Cache.enabled = true;
// Other Three.js defaults to adjust.
THREE.Object3D.DefaultMatrixAutoUpdate = false;

function $_QE(application, application_class, first_world, world_environment) {
    this.engine_main_loop  = this._engine_loop.bind(this);
    this.manager_hud       = new $_QE.prototype.HUDManager(this);
    this.client            = new $_QE.prototype.Client(this);
    this.first_world_class = first_world;
    this.world_environment = world_environment;

    // If current client's browsers has all needed features then create and run the main engine and application provided.
    if (this.client.are_required_features_enabled()) {
        this.application = application;
        this.application = new application_class();
        this._initialize_engine();
    } else {
        this.fatal_error('Engine failed to load! Missing features {' + this.client.get_names_of_required_features_not_enabled() + '}');
    }
}

$_QE.prototype = {
    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */
    // Step : 0x0
    _initialize_engine: function() {
        let me              = this;

        // Start the load of asset files.
        this.manager_hud.set_sub_title('asset files');
        this.manager_heap   = this.get_heap_manager();
        this.manager_assets = new $_QE.prototype.AssetManager(this);
        this.manager_icons  = new $_QE.prototype.IconManager(this);

        let on_load         = this.manager_assets.load_pre_render_assets(this);

        this.client.full_initialize();

        on_load.then(function() {
            //l('LOADING FINISHED!');
            me.manager_icons.initialize();
            me.manager_hud.set_sub_title('worlds');
            me._initialize_for_first_render();
        }).catch(function(error) {
            me.fatal_error('loading assets {' + error + '}', error);
        });
    },

    // Step : 0x1
    _initialize_for_first_render: function() {
        //l('Setting up first render!');

        // temp test
        this.manager_hud.set_sub_title('creating worlds');
        //

        this.manager_renderer = new $_QE.prototype.RendererManager(this);
        this.player           = new $_QE.prototype.Player(this);
        this.manager_world    = new $_QE.prototype.WorldManager(this);

        this.manager_renderer.initialize_shaders(this.manager_world.first_world);
        this.manager_hud.initialize();

        // Create input handlers and has player object set up its controls.
        this.manager_input = new $_QE.prototype.InputManager(this);
        this.player.initialize_player_controls();

        this.manager_world.set_current_world(this.manager_world.first_world);

        // Perform one psedu engine loop.
        this.manager_world.physics(this._engine_time_per_frame_physics);
        this.manager_world.update(this._engine_time_per_frame_physics);
        this.manager_renderer.render(this._engine_time_per_frame_physics);
        //

        this.pause_engine();

        // Connect to websockets.
        this.manager_web_sockets = new $_QE.prototype.WebSocketManager(this);

        this.application.engine_started();

        this.engine_main_loop();
    },
};
