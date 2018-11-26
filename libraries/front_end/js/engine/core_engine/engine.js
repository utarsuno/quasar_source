'use strict';

// Caches files loaded by the FileLoader.
THREE.Cache.enabled = true;
// Other Three.js defaults to adjust.
THREE.Object3D.DefaultMatrixAutoUpdate = false;


function $_QE(application, application_class, first_world) {
    this.engine_main_loop  = this._engine_loop.bind(this);
    this._initialize_hud_pause_menu();
    this.first_world_class = first_world;

    // If current client's browsers has all needed features then create and run the main engine and application provided.
    if (this._are_required_features_enabled()) {
        this.application = application;
        this.application = new application_class();
        this._initialize_cache();
        this._initialize_engine();
        this._initialize_state();
    } else {
        this.fatal_error('Engine failed to load! Missing features {' + this.get_names_of_required_features_not_enabled() + '}');
    }
}

$_QE.prototype = {
    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */
    _initialize_web_features: function() {
        this._set_binding_resize();
        this._set_binding_fullscreen();
        this._set_binding_pointer_lock();

        // Used for downloading a canvas as an image.
        this.manager_canvas = new $_QE.prototype.CanvasSaver();
    },

    // Step : 0x0
    _initialize_engine: function() {
        let me              = this;

        // Start the load of asset files.
        this.pause_menu_set_sub_title('asset files');
        this.manager_heap   = this.get_heap_manager();
        this.manager_assets = new $_QE.prototype.AssetManager(this);
        this.manager_time   = new $_QE.prototype.TimeManager();
        this.manager_text2D = new $_QE.prototype._Text2DHelper(this);

        let on_load         = this.manager_assets.load_pre_render_assets(this);

        this._initialize_web_features();

        on_load.then(function() {
            //l('LOADING FINISHED!');
            me.pause_menu_set_sub_title('worlds');
            me._initialize_for_first_render();
        }).catch(function(error) {
            me.fatal_error('loading assets {' + error + '}', error);
        });
    },

    // Step : 0x1
    _initialize_for_first_render: function() {
        this.pause_menu_set_sub_title('creating worlds');

        this._initialize_renderer();
        this.player           = new $_QE.prototype.Player(this);
        this.manager_world    = new $_QE.prototype.WorldManager(this);
        this.manager_world.__init__();

        this.initialize_shaders(this.manager_world.first_world);
        this._initialize_hud();

        this._initialize_input_controls();

        //
        this.set_state(QEFLAG_STATE_RUNNING);
        //

        this.manager_world.set_current_world(this.manager_world.first_world);

        // Perform one psedu engine loop.
        this.manager_world.physics(this._cachef[QECACHEF_FPS_PHYSICS]);
        this.manager_world.update(this._cachef[QECACHEF_FPS_PHYSICS]);
        this.render(this._cachef[QECACHEF_FPS_PHYSICS]);
        //

        this.set_state(QEFLAG_STATE_PAUSED);
        this.player._initialize_state(PLAYER_STATE_FULL_CONTROL);

        // Connect to websockets.
        this.manager_web_sockets = new $_QE.prototype.WebSocketManager(this);

        this.application.engine_started();

        this.engine_main_loop();
    },
};
