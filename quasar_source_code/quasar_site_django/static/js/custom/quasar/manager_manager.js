'use strict';

// Sets up all the global managers.
// They are defined in an individual file to emphasis that their import order matters.

// 0x0 : Checks for WebGL and creates the canvas + camera.
MANAGER_RENDERER = new RendererManager();
// 0x0 : Handles all shaders.
//MANAGER_SHADER      = new ShaderAPI();

// 0x1 : Handles most I/O and sends events to needed objects.
MANAGER_INPUT    = new InputManager();


// 0x2 : Model of the user.
CURRENT_PLAYER = new Player();


// 0x3 : Handles specifically pointer lock.
MANAGER_POINTER_LOCK = new PointerLockManager();
// 0x3 : Handles the debug display.
MANAGER_DATA_DISPLAY = new DataDisplay();


// 0x4 : The paused menu.
GUI_PAUSED_MENU      = new PausedMenu();
// 0x4 : The HTML typing interface.
GUI_TYPING_INTERFACE = new TypingInterface();


// 0x5 : Handles most if not all of the resource loading.
MANAGER_LOADING     = new LoadingManager();
// 0x5 : Handles all audio operations.
MANAGER_AUDIO       = new AudioManager();
// 0x5 : Handles cookies.
MANAGER_COOKIES     = Cookies.noConflict();
// 0x5 : Handles all static and dynamic worlds.
MANAGER_WORLD       = new WorldManager();
// 0x5 : Handles all user and shared entities.
MANAGER_ENTITY      = new EntityManager();
// 0x5 : Handles all multi-player/online interaction.
MANAGER_MULTIPLAYER = new MultiPlayerManager();

