'use strict';

const DEBUG_MODE_NONE = 1; // #pre-process_global_constant
const DEBUG_MODE_FPS  = 2; // #pre-process_global_constant
const DEBUG_MODE_FULL = 3; // #pre-process_global_constant

function Client() {
    this.__init__();
}

Client.prototype = {

    __init__: function() {
        this._initialize_pause_menu();
        this.detect_client_state();
        // TODO : Save the username here.
    },

    set_quasar: function(q) {
        this.quasar = q;
    },

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

    supports_webgl: function() {
        return this.has_webgl;
    },

    detect_client_state: function() {
        this.has_webgl   = !!window.WebGLRenderingContext;

        // If WebGL is not supported then display an error message. The Quasar main loop will not be started.
        this.set_pause_menu_text_and_sub_text('WebGL not supported!', 'Please use a different browser.');
        this.show_pause_menu();
    },

    initialize: function() {
        this.debug_mode   = DEBUG_MODE_FPS;
        this.stats_api    = new StatsAPI();
        this.data_display = new DataDisplay();

        this.has_canvas  = !!window.CanvasRenderingContext2D;
        this.has_workers = !!window.Worker;
        // From : https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
        this.is_mobile  = false;
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            this.is_mobile = true;
        }
        this.has_vr = false;
        if (navigator.getVRDisplays !== undefined) {
            let displays = navigator.getVRDisplays();
            if (displays.length !== 0) {
                this.has_vr = true;
            }
        }

        this._initialize_fullscreen();
        this._initialize_pointer_lock();

        // Inherit.
        CookieManager.call(this);
        SessionManager.call(this);
        MessageLogManager.call(this);
    },

    set_debug_mode: function(debug_mode) {
        this.debug_mode = debug_mode;

        if (this.debug_mode === DEBUG_MODE_NONE) {
            this.stats_api.hide();
            this.data_display.hide();
        } else if (this.debug_mode === DEBUG_MODE_FPS) {
            this.stats_api.show();
            this.data_display.hide();
        } else {
            this.stats_api.show();
            this.data_display.show();
        }
    },

    pre_render: function() {
        if (this.debug_mode === DEBUG_MODE_FPS || this.debug_mode === DEBUG_MODE_FULL) {
            this.stats_api.pre_render();
        }
    },

    update: function() {
        if (this.debug_mode === DEBUG_MODE_FULL) {
            this.data_display.update();
        }
    },

    post_render: function() {
        if (this.debug_mode === DEBUG_MODE_FPS || this.debug_mode === DEBUG_MODE_FULL) {
            this.stats_api.post_render();
        }
    },

    resume: function() {
        this.hide_pause_menu();
        if (!this.is_mobile) {
            this.request_pointer_lock();
        }
        this.quasar.reset_delta();
    },

    /*__   __         ___  ___  __           __   __
     |__) /  \ | |\ |  |  |__  |__)    |    /  \ /  ` |__/
     |    \__/ | | \|  |  |___ |  \    |___ \__/ \__, |  \ */
    // https://www.html5rocks.com/en/tutorials/pointerlock/intro/

    _initialize_pointer_lock: function() {
        this._document_body = document.body;
        this.has_pointer_lock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if (this.has_pointer_lock) {
            // Hook pointer lock state change events.
            document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), false);
            document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), false);
            document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), false);
            // Hook pointer lock error events.
            document.addEventListener('pointerlockerror', this.pointer_lock_error.bind(this), false);
            document.addEventListener('mozpointerlockerror', this.pointer_lock_error.bind(this), false);
            document.addEventListener('webkitpointerlockerror', this.pointer_lock_error.bind(this), false);
        }
    },

    pointer_lock_change: function () {
        if (document.pointerLockElement !== this._document_body && document.mozPointerLockElement !== this._document_body && document.webkitPointerLockElement !== this._document_body) {
            CURRENT_PLAYER.set_state(PLAYER_STATE_PAUSED);
            this.pointer_is_locked = true;
        } else {
            this.pointer_is_locked = false;
        }
    },

    pointer_lock_error: function(e) {
        if (!CURRENT_CLIENT.is_mobile) {
            raise_exception_with_full_logging('Pointer lock error {' + e + '}!');
        }
    },

    request_pointer_lock: function() {
        this._document_body.requestPointerLock = this._document_body.requestPointerLock || this._document_body.mozRequestPointerLock || this._document_body.webkitRequestPointerLock;
        this._document_body.requestPointerLock();
    },

    release_pointer_lock: function() {
        document.exitPointerLock();
    },

    /*___                 __   __   __   ___  ___
     |__  |  | |    |    /__` /  ` |__) |__  |__  |\ |
     |    \__/ |___ |___ .__/ \__, |  \ |___ |___ | \| */
    _initialize_fullscreen: function() {
        this.has_fullscreen = !!document.webkitCancelFullScreen || !!document.mozCancelFullScreen;
        if (this.has_fullscreen) {
            this._fullscreen_api_0 = document.webkitCancelFullScreen;
            this.in_full_screen = this._is_in_fullscreen();
        }
    },

    toggle_fullscreen: function() {
        if (this.in_full_screen) {
            this.exit_fullscreen();
        } else {
            this.enter_fullscreen();
        }
        this.in_full_screen = !this.in_full_screen;
    },

    enter_fullscreen: function() {
        if (is_defined(this._fullscreen_api_0)) {
            document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            document.body.mozRequestFullScreen();
        }
    },

    exit_fullscreen: function() {
        if (is_defined(this._fullscreen_api_0)) {
            document.webkitCancelFullScreen();
        } else {
            document.mozCancelFullScreen();
        }
    },

    _is_in_fullscreen: function() {
        if (is_defined(this._fullscreen_api_0)) {
            return document.webkitIsFullScreen;
        } else {
            return document.mozFullScreen;
        }
    },

    /*__             __   ___           ___
     |__)  /\  |  | /__` |__      |\/| |__  |\ | |  |
     |    /~~\ \__/ .__/ |___     |  | |___ | \| \__/ */
    _initialize_pause_menu: function() {
        this.background_coloring = new DomElement('background_coloring');
        this.pause_menu          = new DomElement('pause_menu');
        this.pause_menu.set_display_style('table');
        this.pause_title         = new DomElement('menu_title');
        this.pause_sub_title     = new DomElement('menu_header');
    },

    set_pause_menu_text_and_sub_text: function(text, sub_text) {
        this.pause_title.set_text(text);
        this.pause_sub_title.set_text(sub_text);
    },

    pause: function() {
        this.set_pause_menu_text_and_sub_text('paused', 'double click anywhere to resume');
        this.show_pause_menu();
    },

    show_pause_menu: function() {
        this.pause_menu.show();
        this.background_coloring.set_id('background_coloring');
    },

    hide_pause_menu: function() {
        this.pause_menu.hide();
        this.background_coloring.set_id('no_background_coloring');
    }
};