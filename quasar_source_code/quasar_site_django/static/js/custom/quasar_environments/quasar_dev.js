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
var player = new Player(renderer_api);

MANAGER_WORLD.set_player(player);
MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login);

GUI_PAUSED_MENU.provide_player_object(player);
// On start up we will display the paused menu.
GUI_PAUSED_MENU.make_visible();

// Now create the global audio.
MANAGER_AUDIO = new AudioManager(player);


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
    player.update(delta);
    MANAGER_WORLD.update_current_scene();

    // TODO !!!! : Updates should only be sent if the player position and/or look_at has changed.
    total_delta += delta;
    if (total_delta >= position_update_interval) {
        player.try_to_send_position_update_to_server();
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
