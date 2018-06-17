'use strict';

/*
// Global managers.
let MANAGER_MANAGER      = null;
let MANAGER_HEAP         = null;
let MANAGER_SPRITESHEET  = null;
let MANAGER_WEB_SOCKETS  = null;
let MANAGER_AUDIO        = null;
let MANAGER_TEXTURE      = null;
let MANAGER_WORLD        = null;
let MANAGER_ENTITY       = null;
//var MANAGER_MULTIPLAYER  = null;
let MANAGER_SHADER       = null;
let MANAGER_RENDERER     = null;
let MANAGER_INPUT        = null;
*/

let QE;


function $_QE() {
    this.__init__();
}

$_QE.prototype = {

    __init__: function() {
        console.log('Quasar Engine created!');
    },

    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */
    check_if_required_features_are_supported: function () {
        this.client = new $_QE.prototype.Client();
        this.client.initialize_state_canvas_support();
        this.client.initialize_state_webgl_support();
        this.client.initialize_pause_menu();
    },

    initialize_and_set_application: function(application) {
        this.application = application;
        this.renderer    = new $_QE.prototype.RendererManager();
        this.client.renderer = this.renderer;
        this.renderer.client = this.client;
        this.client.pre_render_initialize();

    },

    /*___       __          ___          __   __       ___  ___          __   __   __
     |__  |\ | / _` | |\ | |__     |  | |__) |  \  /\   |  |__     |    /  \ /  \ |__)
     |___ | \| \__> | | \| |___    \__/ |    |__/ /~~\  |  |___    |___ \__/ \__/ |    */
    reset_delta: function() {

    }
};


/*
// Engine starts here!
window.onload = function() {
    QE = new $_QE();


    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        MANAGER_MANAGER.set_quasar_main_object(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER, MANAGER_MANAGER);

        MANAGER_MANAGER.initial_asset_loading_start(MANAGER_MANAGER.quasar_main_object);
    }

};




    get_window_properties: function() {
        this.window_width  = window.innerWidth;
        this.window_height = window.innerHeight;
        this.aspect_ratio  = this.window_width / this.window_height;
        CURRENT_CLIENT.height_re_sized(this.window_height);
    },
*/

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
const l = console.log;

function is_defined(object) {
    return object !== null && object !== undefined;
}

$_QE.prototype.DomElement = function(id_name, element) {
    if (id_name === null) {
        this.element = element;
    } else {
        this.element = document.getElementById(id_name);
    }
    this._current_text = null;
    // Default.
    this.display_style = 'block';

    this.prepend_child_element = function(element_id) {
        return this._add_child_element(true, element_id);
    };

    this.append_child_element = function(element_id) {
        return this._add_child_element(false, element_id);
    };

    this.append_to_document_body = function() {
        document.body.appendChild(this.element);
    };

    this.add_class = function(class_name) {
        this.element.classList.add(class_name);
    };

    this.prepend_break = function() {
        let node = document.createElement('br');
        this.element.prepend(node);
    };

    this.add_break_element = function() {
        let node = document.createElement('br');
        this.element.appendChild(node);
    };

    this._add_child_element = function(prepend, element_id) {
        let node = document.createElement('div');
        node.id = element_id;
        if (prepend) {
            this.element.prepend(node);
        } else {
            this.element.appendChild(node);
        }
        return new $_QE.prototype.DomElement(element_id);
    };

    this.get_element = function() {
        return this.element;
    };

    this.get_text = function() {
        return this._current_text;
        //return this.element.innerHTML;
    };

    this.clear = function() {
        this.set_text('');
    };

    this._get_offset = function(o) {
        if (o === 0) {
            return 0;
        }
        return o + 'px';
    };

    this.set_id = function(_id) {
        this.element.id = _id;
    };

    this.set_text = function(text) {
        if (this._current_text !== text) {
            this.element.innerHTML = text;
            this._current_text = text;
        }
    };

    this.set_position_to_absolute = function() {
        this.element.style.position = 'absolute';
    };

    this.set_left_offset = function(o) {
        this.element.style.left = this._get_offset(o);
    };

    this.set_top_offset = function(o) {
        this.element.style.top = this._get_offset(o);
    };

    this.set_color = function(color) {
        this.element.style.color = color;
    };

    this.set_display_style = function(style) {
        this.display_style = style;
    };

    this.hide = function() {
        this.element.style.display = 'none';
        this.hidden = true;
    };

    this.show = function() {
        this.element.style.display = this.display_style;
        this.hidden = false;
    };

    this.is_hidden = function() {
        return this.hidden;
    };

    this.make_invisible = function() {
        this.element.style.visibility = 'hidden';
        this.visible = false;
    };

    this.make_visible = function() {
        this.element.style.visibility = 'visible';
        this.visible = true;
    };

    this.is_visible = function() {
        return this.visible;
    };
};

/*
function DomElement(id_name, element) {
    this.__init__(id_name, element);
}

DomElement.prototype = {

    __init__: function(id_name, element) {
        if (id_name === null) {
            this.element = element;
        } else {
            this.element = document.getElementById(id_name);
        }
        this._current_text = null;
        // Default.
        this.display_style = 'block';
    },

    prepend_child_element: function(element_id) {
        return this._add_child_element(true, element_id);
    },

    append_child_element: function(element_id) {
        return this._add_child_element(false, element_id);
    },

    add_class: function(class_name) {
        this.element.classList.add(class_name);
    },

    prepend_break: function() {
        let node = document.createElement('br');
        this.element.prepend(node);
    },

    add_break_element: function() {
        let node = document.createElement('br');
        this.element.appendChild(node);
    },

    _add_child_element: function(prepend, element_id) {
        let node = document.createElement('div');
        node.id = element_id;
        if (prepend) {
            this.element.prepend(node);
        } else {
            this.element.appendChild(node);
        }
        return new DomElement(element_id);
    },

    get_element: function() {
        return this.element;
    },

    get_text: function() {
        return this._current_text;
        //return this.element.innerHTML;
    },

    clear: function() {
        this.set_text('');
    },

    _get_offset: function(o) {
        if (o === 0) {
            return 0;
        }
        return o + 'px';
    },

    set_id: function(_id) {
        this.element.id = _id;
    },

    set_text: function(text) {
        if (this._current_text !== text) {
            this.element.innerHTML = text;
            this._current_text = text;
        }
    },

    set_position_to_absolute: function() {
        this.element.style.position = 'absolute';
    },

    set_left_offset: function(o) {
        this.element.style.left = this._get_offset(o);
    },

    set_top_offset: function(o) {
        this.element.style.top = this._get_offset(o);
    },

    set_color: function(color) {
        this.element.style.color = color;
    },

    set_display_style: function(style) {
        this.display_style = style;
    },

    hide: function() {
        this.element.style.display = 'none';
        this.hidden = true;
    },

    show: function() {
        this.element.style.display = this.display_style;
        this.hidden = false;
    },

    is_hidden: function() {
        return this.hidden;
    },

    make_invisible: function() {
        this.element.style.visibility = 'hidden';
        this.visible = false;
    },

    make_visible: function() {
        this.element.style.visibility = 'visible';
        this.visible = true;
    },

    is_visible: function() {
        return this.visible;
    }
};
    */

// Debug modes.

// Cookie keys.

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

    this.debug_mode = 2;
    // Gets set by the engine.
    this.renderer = null;

    this.pre_render_initialize = function() {
        this.initialize_state_fullscreen();
        this.initialize_state_pointer_lock();
        this.initialize_state_window_focus();
        this.initialize_state_mobile();
        this.initialize_state_virtual_reality();
        this._fetch_window_dimensions();
        this.renderer.aspect_ratio = this.state_window_width_inner / this.state_window_height_inner;
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
        if (this.debug_mode === 1) {
            this._stats.hide();
            //this.data_display.hide();
        } else if (this.debug_mode === 2) {
            this._stats.show();
            //this.data_display.hide();
        } else {
            this._stats.show();
            //this.data_display.show();
        }
    };

    this.pre_render = function() {
        if (this.debug_mode === 2 || this.debug_mode === 3) {
            this._stats_api.begin();
        }
    };

    this.update = function() {
        if (this.debug_mode === 3) {
            this.data_display.update();
        }
    };

    this.post_render = function() {
        if (this.debug_mode === 2 || this.debug_mode === 3) {
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
        this.background_coloring = new $_QE.prototype.DomElement('background_coloring');
        this.pause_menu          = new $_QE.prototype.DomElement('pause_menu');
        this.pause_menu.set_display_style('table');
        this.pause_title         = new $_QE.prototype.DomElement('menu_title');
        this.pause_sub_title     = new $_QE.prototype.DomElement('menu_header');
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
        this._stats = new $_QE.prototype.DomElement(null, this._stats_api.domElement);
        this._stats.set_id('fps_display');
        this._stats.append_to_document_body();
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

    this.on_window_resize = function(event) {
        this._fetch_window_dimensions();

        this.renderer.window_resize_event();

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
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_window_focus_loss = function(event) {
        this.state_is_in_window_focus = false;
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
            CURRENT_PLAYER.set_state(PLAYER_STATE_PAUSED);
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

$_QE.prototype.RendererManager = function() {
    this.field_of_view = 75;
    this.near_clipping = 1.0;
    this.far_clipping  = 20000.0;
    // Gets set by client.
    this.aspect_ratio  = null;
    // Gets set by engine.
    this.client        = null;

    this.shaders_enabled        = false;
    this.shader_enabled_fxaa    = false;
    this.shader_enabled_outline = false;
    this.shader_enabled_grain   = false;

    this.pre_render_initialize = function() {
        this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: false});
        this.renderer.domElement.id = 'canvas_id';
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.client.state_window_width_inner, this.client.state_window_height_inner);
        this.renderer.setClearColor(0x252525);
        // TODO : DISABLE FOR CSSRENDERING
        //this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.zIndex = 5;
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(this.field_of_view, this.aspect_ratio, this.near_clipping, this.far_clipping);

        // TODO : VR!!!
        //if (CURRENT_CLIENT.has_vr) {
        //    this.renderer.vr.enabled = true;
        //}
    };

    this.post_render_initialize = function() {
        // Inherit.
        //WorldTransition.call(this);
    };

    this.render = function(delta) {
        /*        if (this.in_transition) {
            this._current_transition.render(delta);
        } else {
            this.effect_composer.render(delta);
        }*/
    };

    this._resize_event_shader = function() {
        if (this.shaders_enabled) {
            this.effect_composer.setSize(this.client.state_window_width_inner, this.client.state_window_height_inner);
            if (this.shader_enabled_fxaa) {
                this.effect_FXAA.uniforms['resolution'].value.set(1 / this.client.state_window_width_inner, 1 / this.client.state_window_height_inner);
            }
            if (this.shader_enabled_outline) {
                //this.outline_glow.outline_pass.setSize(this.window_width, this.window_height);
            }
            if (this.shader_enabled_grain) {
                //
            }
        }
    };

    this.window_resize_event = function() {
        //this.aspect_ratio = this.client.state_window_width_inner / this.client.state_window_height_inner;
        //this.camera.aspect = this.aspect_ratio;
        this.camera.aspect = this.client.state_window_width_inner / this.client.state_window_height_inner;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.client.state_window_width_inner, this.client.state_window_height_inner);

        this._resize_event_shader();
    };

    /*
        initialize_shaders: function() {
        this.load_transition_material();

        this.effect_composer = new THREE.EffectComposer(this.renderer);
        this.render_pass = new THREE.RenderPass(MANAGER_WORLD.world_login.scene, this.camera);
        this.effect_composer.addPass(this.render_pass);

        //this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this.window_width, this.window_height), MANAGER_WORLD.world_login.scene, this.camera);
        //this.effect_composer.addPass(this.outline_pass);

        if (!this.current_client.is_mobile) {

            this.effect_FXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effect_FXAA.uniforms['resolution'].value.set(1 / this.window_width, 1 / this.window_height);
            //this.effect_FXAA.renderToScreen = true;
            this.effect_composer.addPass(this.effect_FXAA);

            this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this.window_width, this.window_height), MANAGER_WORLD.world_login.scene, this.camera);
            this.effect_composer.addPass(this.outline_pass);

            this.effect_film = new FilmNoise();
            this.effect_film.renderToScreen = true;
            this.effect_composer.addPass(this.effect_film);
        }

        //this.outline_glow = new OutlineGlow(this.outline_pass);

        if (this.current_client.is_mobile) {

            //this.copy_pass = new THREE.ShaderPass( THREE.CopyShader );
            //this.copy_pass.renderToScreen = true;
            //this.effect_composer.addPass(this.copy_pass);

            this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this.window_width, this.window_height), MANAGER_WORLD.world_login.scene, this.camera);
            this.effect_composer.addPass(this.outline_pass);

            this.effect_FXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effect_FXAA.uniforms['resolution'].value.set(1 / this.window_width, 1 / this.window_height);
            this.effect_FXAA.renderToScreen = true;
            this.effect_composer.addPass(this.effect_FXAA);
        }

        this.outline_glow = new OutlineGlow(this.outline_pass);
    },
     */
};
// Nexus Local starts here!

let NL;

function $_NL() {
    this.__init__();
}

$_NL.prototype = {
    __init__: function() {
        this.application_type = 'nl';
    }
};

window.onload = function() {
    QE = new $_QE();
    QE.check_if_required_features_are_supported();
    if (QE.client.state_is_webgl_enabled && QE.client.state_is_canvas_enabled) {
        console.log('Run Nexus Local!!!');
        NL = new $_NL();
        QE.initialize_and_set_application(NL);
    } else {
        console.log('ERROR: WebGL or Canvas not supported!');
    }



    /*
    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        MANAGER_MANAGER.set_quasar_main_object(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER, MANAGER_MANAGER);

        MANAGER_MANAGER.initial_asset_loading_start(MANAGER_MANAGER.quasar_main_object);
    }
    */

};
