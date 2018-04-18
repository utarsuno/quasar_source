'use strict';

/* __             __        __      __   __        __   __   ___                          __   __   __   ___
  /  \ |  |  /\  /__`  /\  |__)    /__` /  \ |  | |__) /  ` |__      |\/|  /\  | |\ |    /  ` /  \ |  \ |__
  \__X \__/ /~~\ .__/ /~~\ |  \    .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | | \|    \__, \__/ |__/ |___ */

// The main loop will start after the required initial resources have loaded.
function QuasarMainLoop(current_client) {
    this.__init__(current_client);
}

QuasarMainLoop.prototype = {

    __init__: function(current_client) {
        this.current_client          = current_client;
        this.previous_time           = null;
        this.single_render_performed = false;

        // Temporary performance : message logs will get updated every 4rth update.
        this.message_log_update_index = 0;
    },

    run: function() {
        // TODO : Make the messages fade away over time and then appear again whenever the typing menu is present.
        CURRENT_CLIENT.add_server_message_green('Welcome to Quasar!');

        // Game loop below.

        this.previous_time = performance.now();
        this.quasar_main_loop();
    },

    quasar_main_loop: function() {

        requestAnimationFrame(this.quasar_main_loop.bind(this));

        if (CURRENT_PLAYER.current_state !== PLAYER_STATE_PAUSED || !this.single_render_performed) {
            this.current_client.pre_render();

            this.time = performance.now();
            this.delta = (this.time - this.previous_time) / 1000.0;

            this.current_client.update();

            MANAGER_WORLD.update(this.delta);

            if (this.message_log_update_index === 4) {
                CURRENT_CLIENT.update_message_log(this.delta);
                this.message_log_update_index = 0;
            } else {
                this.message_log_update_index += 1;
            }

            MANAGER_RENDERER.render(this.delta);
            this.current_client.post_render();
            this.previous_time = this.time;

            this.single_render_performed = true;
        }
    }
};

const QUASAR = new QuasarMainLoop(CURRENT_CLIENT);

// Load all the initially needed resources. Once loaded start the main loop.
MANAGER_LOADING.perform_initial_load(QUASAR);

