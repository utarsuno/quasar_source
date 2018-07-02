'use strict';

// Debug modes.
const DEBUG_MODE_NONE = 1; // #pre-process_global_constant
const DEBUG_MODE_FPS  = 2; // #pre-process_global_constant
const DEBUG_MODE_FULL = 3; // #pre-process_global_constant

// Cookie keys.
const COOKIE_SHOULD_REMEMBER_USERNAME = 'a'; // #pre-process_global_constant
const COOKIE_REMEMBERED_USERNAME      = 'b'; // #pre-process_global_constant

$_QE.prototype.Client = function() {

    /*
    Variables available:
        state_is_web_workers_enabled    : null,
        state_is_canvas_enabled         : null,
        state_is_webgl_enabled          : null,
        state_is_mobile_device          : null,
        state_is_virtual_reality_enabled: null,
        state_is_pointer_locked         : null,
        state_is_in_full_screen         : null,
        state_is_in_debug_mode          : null,
        state_is_in_window_focus        : null,

        state_window_width_inner        : null,
        state_window_width_outer        : null,
        state_window_height_inner       : null,
        state_window_height_outer       : null,
     */

    this.debug_mode = DEBUG_MODE_NONE;
    this.renderer = null;

    this.pre_render_initialize = function(renderer) {
        this.renderer = renderer;
        this.initialize_state_fullscreen();
        this.initialize_state_pointer_lock();
        this.initialize_state_window_focus();
        this.initialize_state_mobile();
        this.initialize_state_virtual_reality();
        this._fetch_window_dimensions();
        this.renderer.pre_render_initialize();

        this.initialize_window_resize();
    };

    this.post_render_initialize = function() {
        this.initialize_stats_display();
        this.initialize_state_status_web_workers();
        this.initialize_cookies();
    };

    /*
        add_welcome_message: function() {
            this.add_server_message_green('Welcome to Quasar!');
            if (this.has_vr) {
                this.add_server_message_green('VR detected!');
            } else {
                this.add_server_message_red('VR not detected!');
            }
            if (!this.has_pointer_lock) {
                this.add_server_message_red('Mouse pointer lock not supported!');
            }
            if (!this.has_fullscreen) {
                this.add_server_message_red('Full-screen not supported!');
            }
        },

            //this.stats_api    = new $_QE.prototype.ClientStatsAPI();
            //this.data_display = new $_QE.prototype.ClientDataDisplay();

            //this._initialize_stats_display();

            this._initialize_web_workers_support();
            this._initialize_virtual_reality();
            this._initialize_window_resize();

            // Inherit.
            //$_QE.prototype.ClientCookieManager.call(this);
            //$_QE.prototype.ClientSessionManager.call(this);
            //$_QE.prototype.ClientMessageLogManager.call(this);

        */

    this.set_debug_mode = function(debug_mode) {
        this.debug_mode = debug_mode;
        if (this.debug_mode === DEBUG_MODE_NONE) {
            this._stats_dom.hide();
            //this.data_display.hide();
        } else if (this.debug_mode === DEBUG_MODE_FPS) {
            this._stats_dom.show();
            //this.data_display.hide();
        } else {
            this._stats_dom.show();
            //this.data_display.show();
        }
    };

    this.pre_render = function() {
        if (this.debug_mode === DEBUG_MODE_FPS || this.debug_mode === DEBUG_MODE_FULL) {
            this._stats_api.begin();
        }
    };

    this.update = function() {
        if (this.debug_mode === DEBUG_MODE_FULL) {
            this.data_display.update();
        }
    };

    this.post_render = function() {
        if (this.debug_mode === DEBUG_MODE_FPS || this.debug_mode === DEBUG_MODE_FULL) {
            this._stats_api.end();
        }
    };

    this.resume = function() {
        this.hide_pause_menu();
        if (!this.state_is_mobile_device) {
            this.request_pointer_lock();
        }
        QE.reset_delta();
    };

    /*__   __   __          ___  __           __
     /  ` /  \ /  \ |__/ | |__  /__`     /\  |__) |
     \__, \__/ \__/ |  \ | |___ .__/    /~~\ |    | */
    this.initialize_cookies = function() {
        this.cookies = Cookies.noConflict();
    };

    this.get_cookie = function(cookie_key) {
        let v = this.cookies.get(cookie_key);
        if (v === 'true' || v === 'True') {
            return true;
        } else if (v === 'false' || v === 'False') {
            return false;
        }
        return v;
    };

    this.has_cookie = function(cookie_key) {
        return is_defined(this.cookies.get(cookie_key));
    };

    this.set_cookie = function(cookie_key, cookie_value) {
        this.cookies.set(cookie_key, cookie_value);
    };

    /*__                       __      __        __   __   __   __  ___
     /  `  /\  |\ | \  /  /\  /__`    /__` |  | |__) |__) /  \ |__)  |
     \__, /~~\ | \|  \/  /~~\ .__/    .__/ \__/ |    |    \__/ |  \  |  */
    this.initialize_state_canvas_support = function() {
        this.state_is_canvas_enabled = !!window.CanvasRenderingContext2D;
    };

    /*     ___  __   __           __   ___ ___  ___  __  ___    __
     |  | |__  |__) / _` |       |  \ |__   |  |__  /  `  |  | /  \ |\ |
     |/\| |___ |__) \__> |___    |__/ |___  |  |___ \__,  |  | \__/ | \| */
    this.initialize_state_webgl_support = function() {
        this.state_is_webgl_enabled = !!window.WebGLRenderingContext;
    };

    /*__             __   ___           ___
     |__)  /\  |  | /__` |__      |\/| |__  |\ | |  |
     |    /~~\ \__/ .__/ |___     |  | |___ | \| \__/ */
    this.initialize_pause_menu = function() {
        this.background_coloring = new $_QE.prototype.DomElement('background_coloring', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV, false);
        this.pause_menu          = new $_QE.prototype.DomElement('pause_menu', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV, false);
        this.pause_menu.set_display_style('table');
        this.pause_title         = new $_QE.prototype.DomElement('menu_title', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_H1, true);
        this.pause_sub_title     = new $_QE.prototype.DomElement('menu_header', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_H5, true);
    };

    this.set_pause_menu_text_and_sub_text = function(text, sub_text) {
        this.pause_title.set_text(text);
        this.pause_sub_title.set_text(sub_text);
    };

    this.pause = function() {
        this.set_pause_menu_text_and_sub_text('paused', 'double click anywhere to resume');
        this.show_pause_menu();
    };

    this.show_pause_menu = function() {
        this.pause_menu.show();
        this.background_coloring.set_id('background_coloring');
    };

    this.hide_pause_menu = function() {
        this.pause_menu.hide();
        this.background_coloring.set_id('no_background_coloring');
    };

    /*     __   __          ___     __   ___ ___  ___  __  ___    __
     |\/| /  \ |__) | |    |__     |  \ |__   |  |__  /  `  |  | /  \ |\ |
     |  | \__/ |__) | |___ |___    |__/ |___  |  |___ \__,  |  | \__/ | \| */
    this.initialize_state_mobile = function() {
        // From : https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
        this.state_is_mobile_device = false;
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            this.state_is_mobile_device = true;
        }
    };

    /*___  __   __       __     __   __
     |__  |__) /__`     |  \ | /__` |__) |     /\  \ /
     |    |    .__/ ___ |__/ | .__/ |    |___ /~~\  |  */
    this.initialize_stats_display = function() {
        this._stats_api = new Stats();
        this._stats_api.showPanel(0);

        this._stats_dom = new $_QE.prototype.DomElement(this._stats_api.domElement, DOM_ELEMENT_CONSTRUCTOR_TYPE_ELEMENT, DOM_ELEMENT_DIV, false);
        this._stats_dom.set_id('fps_display');
        this._stats_dom.append_to_document_body();
    };

    /*     __   __        ___  __   __      __        __   __   __   __  ___
     |  | /  \ |__) |__/ |__  |__) /__`    /__` |  | |__) |__) /  \ |__)  |
     |/\| \__/ |  \ |  \ |___ |  \ .__/    .__/ \__/ |    |    \__/ |  \  |  */
    this.initialize_state_status_web_workers = function() {
        this.state_is_web_workers_enabled = !!window.Worker;
    };


    /*       __  ___                    __   ___             ___
     \  / | |__)  |  |  |  /\  |       |__) |__   /\  |    |  |  \ /
      \/  | |  \  |  \__/ /~~\ |___    |  \ |___ /~~\ |___ |  |   |  */
    this.initialize_state_virtual_reality = function() {
        this.state_is_virtual_reality_enabled = false;
        if (navigator.getVRDisplays !== undefined) {
            let displays = navigator.getVRDisplays();
            if (displays.length !== 0) {
                this.state_is_virtual_reality_enabled = true;
            }
        }
    };

    /*            __   __           __   ___  __    __  ___
     |  | | |\ | |  \ /  \ |  |    |__) |__  /__` |  / |__
     |/\| | | \| |__/ \__/ |/\|    |  \ |___ .__/ | /_ |___ */
    this.initialize_window_resize = function() {
        window.addEventListener('resize', this.on_window_resize.bind(this), true);
    };

    this._fetch_window_dimensions = function() {
        this.state_window_width_inner  = window.innerWidth;
        this.state_window_width_outer  = window.outerWidth;
        this.state_window_height_inner = window.innerHeight;
        this.state_window_height_outer = window.outerHeight;
    };

    this._on_window_resize = function() {
        this._fetch_window_dimensions();
        this.renderer.window_resize_event();
    };

    this.on_window_resize = function(event) {
        // FOR_DEV_START
        l('Window resize event! Printing the event!');
        l(event);
        // FOR_DEV_END
        this._on_window_resize();
        event.preventDefault();
        event.stopPropagation();
    };

    /*            __   __           ___  __   __        __
     |  | | |\ | |  \ /  \ |  |    |__  /  \ /  ` |  | /__`
     |/\| | | \| |__/ \__/ |/\|    |    \__/ \__, \__/ .__/ */
    this.initialize_state_window_focus = function() {
        // TODO : Don't make this assumed?
        this.state_is_in_window_focus = true;
        window.addEventListener('focus', this.on_window_focus_gain.bind(this), true);
        window.addEventListener('blur', this.on_window_focus_loss.bind(this), true);
    };

    this.on_window_focus_gain = function(event) {
        this.state_is_in_window_focus = true;
        // FOR_DEV_START
        l('Window gained focus! Printing the event!');
        l(event);
        // FOR_DEV_END
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_window_focus_loss = function(event) {
        this.state_is_in_window_focus = false;
        // FOR_DEV_START
        l('Window lost focus! Printing the event!');
        l(event);
        // FOR_DEV_END
        event.preventDefault();
        event.stopPropagation();
    };

    /*__   __         ___  ___  __           __   __
     |__) /  \ | |\ |  |  |__  |__)    |    /  \ /  ` |__/
     |    \__/ | | \|  |  |___ |  \    |___ \__/ \__, |  \ */
    // https://www.html5rocks.com/en/tutorials/pointerlock/intro/

    this.initialize_state_pointer_lock = function() {
        this._document_body = document.body;
        this.has_pointer_lock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if (this.has_pointer_lock) {
            // Hook pointer lock state change events.
            document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), true);
            document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), true);
            document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), true);
            // Hook pointer lock error events.
            document.addEventListener('pointerlockerror', this.pointer_lock_error.bind(this), true);
            document.addEventListener('mozpointerlockerror', this.pointer_lock_error.bind(this), true);
            document.addEventListener('webkitpointerlockerror', this.pointer_lock_error.bind(this), true);
        }
    };

    this.pointer_lock_change = function () {
        if (document.pointerLockElement !== this._document_body && document.mozPointerLockElement !== this._document_body && document.webkitPointerLockElement !== this._document_body) {
            QE.player.set_state(PLAYER_STATE_PAUSED);
            this.state_is_pointer_locked = true;
        } else {
            this.state_is_pointer_locked = false;
        }
    };

    this.pointer_lock_error = function(e) {
        if (!this.state_is_mobile_device) {
            raise_exception_with_full_logging('Pointer lock error {' + e + '}!');
        }
    };

    this.request_pointer_lock = function() {
        this._document_body.requestPointerLock = this._document_body.requestPointerLock || this._document_body.mozRequestPointerLock || this._document_body.webkitRequestPointerLock;
        this._document_body.requestPointerLock();
    };

    this.release_pointer_lock = function() {
        document.exitPointerLock();
    };

    /*___                 __   __   __   ___  ___
     |__  |  | |    |    /__` /  ` |__) |__  |__  |\ |
     |    \__/ |___ |___ .__/ \__, |  \ |___ |___ | \| */
    this.initialize_state_fullscreen = function() {
        this.has_fullscreen = !!document.webkitCancelFullScreen || !!document.mozCancelFullScreen;
        if (this.has_fullscreen) {
            this._fullscreen_api_0 = document.webkitCancelFullScreen;
            this.state_is_in_full_screen = this._is_in_fullscreen();
        }
    };

    this.toggle_fullscreen = function() {
        if (this.state_is_in_full_screen) {
            this.exit_fullscreen();
        } else {
            this.enter_fullscreen();
        }
        this.state_is_in_full_screen = !this.state_is_in_full_screen;
    };

    this.enter_fullscreen = function() {
        if (is_defined(this._fullscreen_api_0)) {
            document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            document.body.mozRequestFullScreen();
        }
        this.state_is_in_full_screen = true;
    };

    this.exit_fullscreen = function() {
        if (is_defined(this._fullscreen_api_0)) {
            document.webkitCancelFullScreen();
        } else {
            document.mozCancelFullScreen();
        }
        this.state_is_in_full_screen = false;
    };

    this._is_in_fullscreen = function() {
        if (is_defined(this._fullscreen_api_0)) {
            return document.webkitIsFullScreen;
        } else {
            return document.mozFullScreen;
        }
    };


};
