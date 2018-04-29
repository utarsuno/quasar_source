'use strict';

function ManagerManager() {
    this.__init__();
}

ManagerManager.prototype = {

    __init__: function() {
        this.manager_loading = null;

        // Gets information needed regarding the connected client.
        CURRENT_CLIENT = new Client();
    },

    delete_loading_manager: function() {
        // Delete the LoadingManager.
        delete ManagerManager.prototype.set_loading_manager;
        this.manager_loading = null;
        delete this.manager_loading;

        // Delete the AssetLoader base class.
        delete ManagerManager.prototype.AssetLoaderGroup;

        // Delete the AudioLoader.
        delete ManagerManager.prototype.set_audio_loader;
        this.audio_loader = null;
        delete this.audio_loader;

        // Delete the TextureLoader.
        delete ManagerManager.prototype.set_texture_loader;
        this.texture_loader = null;
        delete this.texture_loader;
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
        MANAGER_INPUT        = new InputManager();

        // Give the current player a reference to the input manager.
        CURRENT_PLAYER.fps_controls.set_input_manager_reference(MANAGER_INPUT);

        /*__   ___  __   __        __   __   ___                          __   ___  __   __
         |__) |__  /__` /  \ |  | |__) /  ` |__      |\/|  /\  |\ |  /\  / _` |__  |__) /__`
         |  \ |___ .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
        // Handles most if not all of the resource loading.
        //MANAGER_LOADING   = new LoadingManager();
        // Handles all audio operations.
        MANAGER_AUDIO     = new AudioManager();
        // Handles all shaders.
        MANAGER_SHADER    = new ShaderManager();
        // Handles all textures.
        MANAGER_TEXTURE   = new TextureManager();
        // Handles all svg files.
        MANAGER_SPRITESHEET = new SpriteSheetManager();
        // Handles images that get dropped onto the site page.
        //var DRAG_AND_DROP = new DragNDrop();

        MANAGER_HEAP     = new HeapManager();

        /*     __   __        __                           __   ___  __   __
         |  | /  \ |__) |    |  \     |\/|  /\  |\ |  /\  / _` |__  |__) /__`
         |/\| \__/ |  \ |___ |__/     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
        // Handles all static and dynamic worlds.
        MANAGER_WORLD          = new WorldManager();


        // Handles all user and shared entities.
        MANAGER_ENTITY      = new EntityManager();

        // Handles all multi-player/online interaction.
        //MANAGER_MULTIPLAYER = new MultiPlayerManager();
    }
};