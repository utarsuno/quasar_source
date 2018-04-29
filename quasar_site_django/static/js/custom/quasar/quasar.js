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

    run: function() {
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