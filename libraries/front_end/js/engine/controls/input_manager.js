'use strict';

$_QE.prototype.InputManager = function(engine) {
    this.engine               = engine;
    this.player               = this.engine.player;
    this.player.input_manager = this;
    this.manager_world        = this.engine.manager_world;

    /*
            if (CURRENT_CLIENT.is_mobile) {
            // Inherit needed mobile controls.
            MobileInputManager.call(this);
            //MobileButtonManager.call(this);
            MobileKeyboard.call(this);
        } else {
            // Check if the desktop client has touch controls in order to disable pinch zoom events.
            if ('ontouchstart' in window) {
                l('DESKTOP CLIENT HAS ONTOUCHSTART');
                MobileInputManager.call(this);
            }
        }

     */

    this.key_down_up       = false;
    this.key_down_down     = false;
    this.key_down_left 	   = false;
    this.key_down_right    = false;
    this.key_down_space    = false;
    this.key_down_shift    = false;

    this.left_click_timer = new THREE.Clock();
    this.left_click_timer.start();

    /* The flag that determines whether the wheel event is supported. */
    this.supports_wheel    = false;

    this.disable_mouse_y = false;

    this.on_mouse_move = function(event) {
        if (this.player.has_mouse_movement()) {
            if (this.disable_mouse_y) {
                this.player.on_mouse_move(event.movementX || event.mozMovementX || event.webkitMovementX || 0, 0);
            } else {
                this.player.on_mouse_move(event.movementX || event.mozMovementX || event.webkitMovementX || 0, event.movementY || event.mozMovementY || event.webkitMovementY || 0);
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_key_up = function(event) {
        if (this.player.has_movement()) {
            switch (event.keyCode) {
            case KEY_CODE__UP:
            case KEY_CODE_W:
                this.key_down_up = false;
                break;
            case KEY_CODE__LEFT:
            case KEY_CODE_A:
                this.key_down_left = false;
                break;
            case KEY_CODE__DOWN:
            case KEY_CODE_S:
                this.key_down_down = false;
                break;
            case KEY_CODE__RIGHT:
            case KEY_CODE_D:
                this.key_down_right = false;
                break;
            case KEY_CODE__SPACE:
                this.key_down_space = false;
                break;
            case KEY_CODE__SHIFT:
                this.key_down_shift = false;
                break;
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_mouse_up = function(event) {
        event = event || window.event;
        switch (event.which) {
        case CLICK_LEFT:
            if (this.left_click_timer.getDelta() <= .3) {
                this.manager_world.left_click_up(true);
            }
            this.manager_world.left_click_up(false);
            break;
        case CLICK_MIDDLE:
            this.manager_world.middle_click_up();
            break;
        case CLICK_RIGHT:
            this.manager_world.right_click_up();
            break;
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_mouse_down = function(event) {
        event = event || window.event;
        switch (event.which) {
        case CLICK_LEFT:
            this.manager_world.left_click_down();
            break;
        case CLICK_MIDDLE:
            this.manager_world.middle_click_down();
            break;
        case CLICK_RIGHT:
            this.manager_world.right_click_down();
            break;
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_key_down = function(event) {
        if (this.player.has_movement()) {
            switch (event.keyCode) {
            case KEY_CODE__UP:
            case KEY_CODE_W:
                this.key_down_up = true;
                break;
            case KEY_CODE__LEFT:
            case KEY_CODE_A:
                this.key_down_left = true;
                break;
            case KEY_CODE__DOWN:
            case KEY_CODE_S:
                this.key_down_down = true;
                break;
            case KEY_CODE__RIGHT:
            case KEY_CODE_D:
                this.key_down_right = true;
                break;
            case KEY_CODE__SPACE:
                this.key_down_space = true;
                break;
            case KEY_CODE__SHIFT:
                this.key_down_shift = true;
                break;
            default:
                this.manager_world.key_down_event(event);
                break;
            }
        } else {
            this.manager_world.key_down_event(event);
        }

        event.preventDefault();
        event.stopPropagation();
    };

    // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
    this.on_wheel_event = function(event) {
        if (this.player.has_input()) {
            /* Check whether the wheel event is supported. */
            if (event.type == 'wheel') this.supports_wheel = true;
            else if (this.supports_wheel) return;
            /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
            QE.manager_world.on_wheel_event(((event.deltaY || -event.wheelDelta || event.detail) >> 10) || 1);
        }
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_paste = function(event) {
        // Code help from : https://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event
        let clipboard_data = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
        this.manager_world.on_paste_event(clipboard_data.getData('text'));
        event.preventDefault();
        event.stopPropagation();
    };

    this.reset = function() {
        this.key_down_up 	= false;
        this.key_down_down  = false;
        this.key_down_left  = false;
        this.key_down_right = false;
        this.key_down_space = false;
        this.key_down_shift = false;
    };

    document.addEventListener(EVENT_MOUSE_DOWN, this.on_mouse_down.bind(this), true);
    document.addEventListener(EVENT_MOUSE_UP  , this.on_mouse_up.bind(this), true);
    document.addEventListener(EVENT_KEY_DOWN  , this.on_key_down.bind(this), true);
    document.addEventListener(EVENT_KEY_UP    , this.on_key_up.bind(this), true);
    document.addEventListener(EVENT_PASTE     , this.on_paste.bind(this), true);

    document.addEventListener(EVENT_MOUSE_MOVE, this.on_mouse_move.bind(this));

    // Cross browser support for wheel events.
    // Base code from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
    // TODO : Double check to only add one of them and not all 3 if all 3 are supported.
    document.addEventListener(EVENT_WHEEL_V0  , this.on_wheel_event.bind(this), true);
    document.addEventListener(EVENT_WHEEL_V1  , this.on_wheel_event.bind(this), true);
    document.addEventListener(EVENT_WHEEL_V2  , this.on_wheel_event.bind(this), true);

};
