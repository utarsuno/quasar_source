'use strict';

/* __             __        __      __   __        __   __   ___                          __   __   __   ___
  /  \ |  |  /\  /__`  /\  |__)    /__` /  \ |  | |__) /  ` |__      |\/|  /\  | |\ |    /  ` /  \ |  \ |__
  \__X \__/ /~~\ .__/ /~~\ |  \    .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | | \|    \__, \__/ |__/ |___ */

// The main loop will start after the required initial resources have loaded.
function QuasarMainLoop(current_client, current_player, manager_world, manager_renderer) {
    this.__init__(current_client, current_player, manager_world, manager_renderer);
}

QuasarMainLoop.prototype = {

    __init__: function(current_client, current_player, manager_world, manager_renderer) {
        this.current_client          = current_client;
        this.current_player          = current_player;
        this.manager_world           = manager_world;
        this.manager_renderer        = manager_renderer;

        this.previous_time           = null;
        this.single_render_performed = false;

        this._main_loop = this.quasar_main_loop.bind(this);
    },

    asset_loading_completed: function() {
        MANAGER_TEXTURE.create_skybox_material();
        MANAGER_SHADER.create_global_shader_materials();

        this.manager_world.world_login.create();
        this.manager_world.create_singletons();

        this.manager_renderer.login_world_created();
        if (CURRENT_CLIENT.is_mobile) {
            MANAGER_INPUT.load_mobile_keyboard();
        }

        MANAGER_WEB_SOCKETS.connect();

        //if (CURRENT_CLIENT.is_mobile) {
        //    MANAGER_INPUT.create_mobile_buttons();
        //}

        this.manager_world.set_current_world(MANAGER_WORLD.world_login);

        // All the initial resources have loaded so put the player in a paused state in order to gain the first pointer lock control.
        this.current_player.set_state(PLAYER_STATE_PAUSED);
        this.run();
    },

    run: function() {
        this.current_client.add_welcome_message();

        MANAGER_MANAGER.delete_loading_manager();

        this.previous_time = performance.now();
        this.quasar_main_loop();
    },

    quasar_main_loop: function() {
        /*if (CURRENT_CLIENT.has_vr) {
            this.manager_renderer.renderer.animate(this._main_loop);
        } else {
            requestAnimationFrame(this._main_loop);
        }*/

        requestAnimationFrame(this._main_loop);


        if (this.current_player.current_state !== PLAYER_STATE_PAUSED || !this.single_render_performed) {
            this.current_client.pre_render();

            this.time = performance.now();
            this.delta = (this.time - this.previous_time) / 1000.0;

            this.current_client.update();

            this.manager_world.update(this.delta);

            this.current_client.update_message_log(this.delta);

            this.manager_renderer.render(this.delta);
            this.current_client.post_render();
            this.previous_time = this.time;

            this.single_render_performed = true;
        }
    }
};

window.onload = function() {
    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        const QUASAR = new QuasarMainLoop(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER);

        MANAGER_MANAGER.set_loading_manager();
        CURRENT_PLAYER.set_state(PLAYER_STATE_LOADING);
        MANAGER_MANAGER.manager_loading.perform_initial_load(QUASAR);
    }
};
