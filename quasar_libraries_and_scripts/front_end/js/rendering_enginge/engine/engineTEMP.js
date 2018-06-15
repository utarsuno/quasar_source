'use strict';

/*
// Global managers.
let MANAGER_MANAGER      = null;
let MANAGER_HEAP         = null;
let MANAGER_SPRITESHEET  = null;
let MANAGER_WEB_SOCKETS  = null;
let MANAGER_AUDIO        = null;
let MANAGER_TEXTURE      = null;
let MANAGER_WORLD        = null;
let MANAGER_ENTITY       = null;
//var MANAGER_MULTIPLAYER  = null;
let MANAGER_SHADER       = null;
let MANAGER_RENDERER     = null;
let MANAGER_INPUT        = null;
*/


function $_QE() {
    this.__init__();
}

$_QE.prototype = {

    __init__: function() {
        this.manager_loading = null;

        // Gets information needed regarding the connected client.
        CURRENT_CLIENT = new Client();
    },

    perform_initial_heap_cleanup: function() {
        // Delete the LoadingManager.
        //delete ManagerManager.prototype.set_loading_manager;
        ManagerManager.prototype.set_loading_manager = null;
        this.manager_loading = null;
        //delete this.manager_loading;

        // Delete the AssetLoader base class.
        //delete ManagerManager.prototype.AssetLoaderGroup;
        ManagerManager.prototype.AssetLoaderGroup = null;

        // Delete the AudioLoader.
        //delete ManagerManager.prototype.set_audio_loader;
        ManagerManager.prototype.set_audio_loader = null;
        this.audio_loader = null;
        //delete this.audio_loader;

        // Delete the TextureLoader.
        //delete ManagerManager.prototype.set_texture_loader;
        ManagerManager.prototype.set_texture_loader = null;
        this.texture_loader = null;
        //delete this.texture_loader;

        // Delete HexagonGrid class, only used once to create the initial hexagon grid.
        //delete ManagerManager.prototype.HexagonGrid;
        ManagerManager.prototype.HexagonGrid = null;

        // Delete KeyboardModel class, only used once to create the initial keyboard model.
        //delete ManagerManager.prototype.KeyboardModel;
        ManagerManager.prototype.KeyboardModel = null;
    },

    load_all_global_managers: function() {
        CURRENT_CLIENT.initialize();

        // Web socket information.
        MANAGER_WEB_SOCKETS = new WebSocketManager();

        /*__   ___       __   ___  __          __                           __   ___  __   __
         |__) |__  |\ | |  \ |__  |__) | |\ | / _`     |\/|  /\  |\ |  /\  / _` |__  |__) /__`
         |  \ |___ | \| |__/ |___ |  \ | | \| \__>     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
        // Checks for WebGL and creates the canvas + camera.
        MANAGER_RENDERER = new RendererManager(CURRENT_CLIENT);

        /*                    __                 ___  __
         |\/|  /\  | |\ |    |__) |     /\  \ / |__  |__)
         |  | /~~\ | | \|    |    |___ /~~\  |  |___ |  \ */
        // Convenient handle to the main player and state information.
        CURRENT_PLAYER = new Player();

        /*       __       ___                          __   ___  __   __
         | |\ | |__) |  |  |      |\/|  /\  |\ |  /\  / _` |__  |__) /__`
         | | \| |    \__/  |      |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
        // Handles most I/O and sends events to needed objects.
        MANAGER_INPUT = new InputManager();

        // Give the current player a reference to the input manager.
        CURRENT_PLAYER.fps_controls.set_input_manager_reference(MANAGER_INPUT);

        /*__   ___  __   __        __   __   ___                          __   ___  __   __
         |__) |__  /__` /  \ |  | |__) /  ` |__      |\/|  /\  |\ |  /\  / _` |__  |__) /__`
         |  \ |___ .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
        this.set_spritesheet_manager();
        this.set_texture_manager();
        this.set_audio_manager();
        this.set_shader_manager();
        MANAGER_SPRITESHEET = this.spritesheet_manager;
        MANAGER_TEXTURE     = this.texture_manager;
        MANAGER_AUDIO       = this.audio_manager;
        MANAGER_SHADER      = this.shader_manger;

        //var DRAG_AND_DROP = new DragNDrop();

        this.set_heap_manager();
        MANAGER_HEAP = this.heap_manager;

        /*     __   __        __                           __   ___  __   __
         |  | /  \ |__) |    |  \     |\/|  /\  |\ |  /\  / _` |__  |__) /__`
         |/\| \__/ |  \ |___ |__/     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
        // Handles all static and dynamic worlds.
        MANAGER_WORLD          = new WorldManager();


        // Handles all user and shared entities.
        MANAGER_ENTITY      = new EntityManager();

        // Handles all multi-player/online interaction.
        //MANAGER_MULTIPLAYER = new MultiPlayerManager();
    },

    initial_asset_loading_start: function(quasar) {
        this.quasar = quasar;
        CURRENT_PLAYER.set_state(PLAYER_STATE_LOADING);
        MANAGER_MANAGER.set_loading_manager();
        MANAGER_MANAGER.manager_loading.perform_initial_load(this.initial_asset_loading_finished.bind(this));
    },

    initial_asset_loading_finished: function() {
        CURRENT_CLIENT.set_pause_menu_text_and_sub_text('loaded', 'preparing Quasar');
        this.spritesheet_manager.load_icon_sprite_sheet();
        this.texture_manager.create_skybox_material();
        this.shader_manger.create_global_shader_materials();

        MANAGER_WORLD.world_login.create();
        MANAGER_WORLD.create_singletons();

        MANAGER_RENDERER.initialize_shaders();

        if (CURRENT_CLIENT.is_mobile) {
            MANAGER_INPUT.load_mobile_keyboard();
        }

        MANAGER_WEB_SOCKETS.connect();

        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login);
        CURRENT_PLAYER.set_state(PLAYER_STATE_PAUSED);

        CURRENT_CLIENT.add_welcome_message();

        this.quasar.run();
    }
};


/*__             __        __      __  ___       __  ___  __           ___  __   ___
 /  \ |  |  /\  /__`  /\  |__)    /__`  |   /\  |__)  |  /__`    |__| |__  |__) |__
 \__X \__/ /~~\ .__/ /~~\ |  \    .__/  |  /~~\ |  \  |  .__/    |  | |___ |  \ |___ */
window.onload = function() {
    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        MANAGER_MANAGER.set_quasar_main_object(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER, MANAGER_MANAGER);

        MANAGER_MANAGER.initial_asset_loading_start(MANAGER_MANAGER.quasar_main_object);
    }
};
