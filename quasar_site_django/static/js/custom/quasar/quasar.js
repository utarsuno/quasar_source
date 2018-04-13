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
    },

    run: function() {
        // TODO : Make the messages fade away over time and then appear again whenever the typing menu is present.
        GUI_TYPING_INTERFACE.add_server_message('Welcome to Quasar!');

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

            if (GUI_TYPING_INTERFACE.needs_an_update()) {
                GUI_TYPING_INTERFACE.update();
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

