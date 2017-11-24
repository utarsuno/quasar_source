'use strict';

/*__        __   __             __
 / _` |    /  \ |__)  /\  |    /__`
 \__> |___ \__/ |__) /~~\ |___ .__/ */
// Global Managers.
MANAGER_COOKIES     = Cookies.noConflict();
MANAGER_WORLD       = new WorldManager();
MANAGER_ENTITY      = new EntityManager();
MANAGER_MULTIPLAYER = new MultiPlayerManager();

// Global 2D GUI objects.
GUI_PAUSED_MENU      = new PausedMenu();
GUI_TYPING_INTERFACE = new TypingInterface();
///////

/* __             __        __      __   __        __   __   ___                          __   __   __   ___
  /  \ |  |  /\  /__`  /\  |__)    /__` /  \ |  | |__) /  ` |__      |\/|  /\  | |\ |    /  ` /  \ |  \ |__
  \__X \__/ /~~\ .__/ /~~\ |  \    .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | | \|    \__, \__/ |__/ |___ */

// Renders all the worlds.
var renderer_api = new RendererAPI();

// Model of the user. Must be created AFTER the scene gets set.
CURRENT_PLAYER = new Player(renderer_api);

// Sets the player and current world.
MANAGER_WORLD.set_player_and_current_world(MANAGER_WORLD.world_login);

// On start up we will display the paused menu.
GUI_PAUSED_MENU.make_visible();

// Now create the global audio.
MANAGER_AUDIO = new AudioManager();


GUI_TYPING_INTERFACE.add_server_message('Welcome!');


var previous_time = performance.now();


var total_delta = 0;
var position_update_interval = 1 / 20;

var animate = function () {
    requestAnimationFrame(animate);
    renderer_api.pre_render();

    var time = performance.now();
    var delta = (time - previous_time) / 1000.0;

    MANAGER_MULTIPLAYER.update(delta);
    CURRENT_PLAYER.update(delta);
    MANAGER_WORLD.update_current_scene();

    total_delta += delta;
    if (total_delta >= position_update_interval) {
        if (MANAGER_MULTIPLAYER.players.length > 1) {
            CURRENT_PLAYER.try_to_send_position_update_to_server();
        }
        total_delta -= position_update_interval;
    }

    ////
    if (GUI_TYPING_INTERFACE.needs_an_update()) {
        GUI_TYPING_INTERFACE.update();
    }
    ////

    renderer_api.render();
    renderer_api.post_render();

    previous_time = time;
};

animate();
