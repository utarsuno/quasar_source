'use strict';

// Quasar Source starts from this file.

/*__   ___       __   ___  __          __                           __   ___  __   __
 |__) |__  |\ | |  \ |__  |__) | |\ | / _`     |\/|  /\  |\ |  /\  / _` |__  |__) /__`
 |  \ |___ | \| |__/ |___ |  \ | | \| \__>     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
// Checks for WebGL and creates the canvas + camera.
MANAGER_RENDERER = new RendererManager();
//MANAGER_SHADER      = new ShaderAPI();


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
// Handles specifically pointer lock.
MANAGER_POINTER_LOCK = new PointerLockManager();
// Handles the debug display.
MANAGER_DATA_DISPLAY = new DataDisplay();

/*__             __        ___  __
 / _` |  | |    /  \ \  / |__  |__) |     /\  \ /
 \__> \__/ |    \__/  \/  |___ |  \ |___ /~~\  |  */
// The paused menu.
GUI_PAUSED_MENU      = new PausedMenu();
// The HTML typing interface.
GUI_TYPING_INTERFACE = new TypingInterface();

/*__   ___  __   __        __   __   ___                          __   ___  __   __
 |__) |__  /__` /  \ |  | |__) /  ` |__      |\/|  /\  |\ |  /\  / _` |__  |__) /__`
 |  \ |___ .__/ \__/ \__/ |  \ \__, |___     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
// Handles most if not all of the resource loading.
MANAGER_LOADING     = new LoadingManager();
// Handles all audio operations.
MANAGER_AUDIO       = new AudioManager();
// Handles all textures.
MANAGER_TEXTURE     = new TextureManager();
// Handles images that get dropped onto the site page.
var DRAG_AND_DROP = new DragNDrop();
// Handles cookies.
MANAGER_COOKIES     = Cookies.noConflict();

/*     __   __        __                           __   ___  __   __
 |  | /  \ |__) |    |  \     |\/|  /\  |\ |  /\  / _` |__  |__) /__`
 |/\| \__/ |  \ |___ |__/     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/ */
// Handles all static and dynamic worlds.
MANAGER_WORLD          = new WorldManager();
MANAGER_CREATED_WORLDS = new CreatedWorldsManager();




// Handles all user and shared entities.
MANAGER_ENTITY      = new EntityManager();

// Handles all multi-player/online interaction.
MANAGER_MULTIPLAYER = new MultiPlayerManager();



// TODO : Eventually this will need to automatically update at midnight.
CURRENT_DAY_OBJECT = new DayInstance(THIS_DAY);
//const CURRENT_MONTH_OBJECT = new MyDates(THIS_MONTH);
