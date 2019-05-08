'use strict';


let QE;


function $_QE(application, application_first_world) {
    QE                           = this;
    this.application             = application;
    this.engine_main_loop        = this._engine_loop.bind(this);
    // H U D.
    this.pause_background        = new $_QE.prototype.DomElement().__init__external(GLOBAL_ID_PAUSED_BACKGROUND_FILTER);
    this.pause_menu              = new $_QE.prototype.DomElement().__init__external(GLOBAL_ID_PAUSE_DISPLAY, 'table');
    this.pause_title             = new $_QE.prototype.DomElementText().__init__(GLOBAL_ID_SUB_PAUSED_DISPLAY_TITLE);
    this.pause_sub_title         = new $_QE.prototype.DomElementText().__init__(GLOBAL_ID_SUB_PAUSED_DISPLAY_SUB_TITLE);
    this._pause_menu             = new $_QE.prototype._PauseMenu(this);

    this.application_first_world = application_first_world;

    // If current client's browsers has all needed features then create and run the main engine and application provided.
    if (this._are_required_features_enabled()) {
        this.__init__cache();
        this.__init__engine();
        this.__init__state();
    } else {
        let names = '';
        if (this.flag_is_off(QEFLAG_FEATURE_CANVAS)) {
            names += 'Canvas, ';
        }
        if (this.flag_is_off(QEFLAG_FEATURE_WEBGL)) {
            names += 'WebGL, ';
        }
        this.error('Engine failed to load! Missing required features {' + names + '}');
    }
}

$_QE.prototype = {
    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */

    // Step : 0x0
    __init__engine: function() {
        let me              = this;

        this.engine_init_time = new THREE.Clock();
        this.engine_init_time.start();

        // Start the load of asset files.
        this.pause_sub_title.update_text('asset files');
        this.manager_heap   = this.get_heap_manager();
        this.manager_assets = new $_QE.prototype.AssetManager(this);
        this.manager_text2D = new $_QE.prototype._Text2DHelper(this);

        let on_load         = this.manager_assets.load_pre_render_assets(this);

        this.__init__init__();

        this.player         = new $_QE.prototype.Player(this);
        this.manager_world  = new $_QE.prototype.WorldManager(this);

        // H U D.
        this.hud_debug      = new $_QE.prototype.HUDDebug().__init__(this);
        this.hud_chat       = new $_QE.prototype.HUDLogs().__init__(32);
        this.hud_typing     = new $_QE.prototype.HUDUserTyping().__init__(this.application);
        this.hud_date_time  = new $_QE.prototype.HUDDateTime().__init__(this);

        // Utility object to download a canvas as an image.
        this._canvas_saver  = document.createElement('a');

        on_load.then(function() {
            //l('LOADING FINISHED!');
            me.pause_sub_title.update_text('worlds');
            me._initialize_for_first_render();
        }).catch(function(error) {
            me.error('loading assets {' + error + '}', error);
        });
    },

    __init__init__: function() {
        let self = this;

        // E V E N T {window resize}
        window.addEventListener('resize', function(event) {
            event.preventDefault();
            // TODO: Eventually throttle this event (only execute once no event is no longer sent for longer than 200 ms?).
            self._cachei[QECACHEI_WIDTH_INNER]  = window.innerWidth;
            self._cachei[QECACHEI_HEIGHT_INNER] = window.innerHeight;
            self._cachef[QECACHEF_ASPECT_RATIO] = window.innerWidth / window.innerHeight;
            self._update_renderer_dimensions();
            return false;
        }, true);

        // F E A T U R E {full-screen}
        if (document.webkitCancelFullScreen !== null) {
            this.fullscreen_enter     = function() {
                self._cacher_document_body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                self.flag_set_on(QEFLAG_STATE_FULLSCREEN);
            };
            this.fullscreen_exit      = function() {
                document.webkitCancelFullScreen();
                self.flag_set_off(QEFLAG_STATE_FULLSCREEN);
            };
            this._fullscreen_is_active = function() {
                return document.webkitIsFullScreen;
            };
            this.flag_set(QEFLAG_STATE_FULLSCREEN, document.webkitIsFullScreen);
        } else {
            this.fullscreen_enter     = function() {
                self._cacher_document_body.mozRequestFullScreen();
                self.flag_set_on(QEFLAG_STATE_FULLSCREEN);
            };
            this.fullscreen_exit      = function() {
                document.mozCancelFullScreen();
                self.flag_set_off(QEFLAG_STATE_FULLSCREEN);
            };
            this._fullscreen_is_active = function() {
                return document.mozFullScreen;
            };
            this.flag_set(QEFLAG_STATE_FULLSCREEN, document.mozFullScreen);
        }

        // F E A T U R E {pointer lock}
        this.flag_set_off(QEFLAG_STATE_POINTER_LOCK);

        this._events[QEEVENT_ON_POINTER_LOCK_ERROR] = function(error) {
            //if (!this.is_feature_enabled(CLIENT_FEATURE_MOBILE)) {
            self.error('Pointer lock error{' + error + '}');
            //}
        };

        if (this._cacher_document_body.requestPointerLock) {
            document.addEventListener('pointerlockchange', function() {
                self.flag_set(QEFLAG_STATE_POINTER_LOCK, self._cacher_document_body === document.pointerLockElement);
                if (self.flags_are_both_off(QEFLAG_STATE_POINTER_LOCK, QEFLAG_CSS_LOOKED_AT)) {
                    self.set_state(QEFLAG_STATE_PAUSED);
                }
            }, true);
            document.addEventListener('pointerlockerror', self._events[QEEVENT_ON_POINTER_LOCK_ERROR], true);
            self.mouse_lock    = function() {self._cacher_document_body.requestPointerLock();};
            self.mouse_release = function() {document.exitPointerLock();};
        } else if (this._cacher_document_body.mozRequestPointerLock) {
            document.addEventListener('mozpointerlockchange', function() {
                self.flag_set(QEFLAG_STATE_POINTER_LOCK, self._cacher_document_body === document.mozPointerLockElement);
                if (self.flags_are_both_off(QEFLAG_STATE_POINTER_LOCK, QEFLAG_CSS_LOOKED_AT)) {
                    self.set_state(QEFLAG_STATE_PAUSED);
                }
            }, true);
            document.addEventListener('mozpointerlockerror', self._events[QEEVENT_ON_POINTER_LOCK_ERROR], true);
            self.mouse_lock    = function() {self._cacher_document_body.mozRequestPointerLock();};
            this.mouse_release = function() {document.mozExitPointerLock();};
        } else {
            document.addEventListener('webkitpointerlockchange', function() {
                self.flag_set(QEFLAG_STATE_POINTER_LOCK, self._cacher_document_body === document.webkitPointerLockElement);
                if (self.flags_are_both_off(QEFLAG_STATE_POINTER_LOCK, QEFLAG_CSS_LOOKED_AT)) {
                    self.set_state(QEFLAG_STATE_PAUSED);
                }
            }, true);
            document.addEventListener('webkitpointerlockerror', self._events[QEEVENT_ON_POINTER_LOCK_ERROR], true);
            self.mouse_lock    = function() {self._cacher_document_body.webkitRequestPointerLock();};
            self.mouse_release = function() {document.webkitExitPointerLock();};
        }

        // E V E N T {drag and drop}
        self._cacher_document_element.ondragover = function(event) {event.preventDefault();return false;};
        self._cacher_document_element.ondragend  = function(event) {event.preventDefault();return false;};
        self._cacher_document_element.ondrop     = function(event) {
            event.preventDefault();
            if (self._ei_file_reader === null) {
                self._lazy_load_drag_and_drop();
            }
            let f;
            let num_files = event.dataTransfer.files.length;
            let file;
            for (f = 0; f < num_files; f++) {
                file = event.dataTransfer.files[f];
                if (self._ei_queue_file[0] === null || (file !== null && file === self._ei_queue_file[0])) {
                    self._ei_queue_file[0]     = file;
                    self._ei_current_file_type = self._ei_queue_file[0].type;
                    self._ei_file_reader.readAsDataURL(file);
                } else {
                    self._ei_queue_file.push(file);
                }
            }
            return false;
        };

        this.__init__renderer();

        // E V E N T {on hover}
        let css_renderer_dom_element               = this.css_renderer.domElement;
        this._events[QEEVENT_ON_WINDOW_MOUSE_OVER] = function (e) {
            if (e.target !== self._cacher_document_body && (css_renderer_dom_element !== null && e.target !== css_renderer_dom_element)) {
                if (self.manager_world.current_world.has_css_element(e)) {
                    self.flag_set_on(QEFLAG_CSS_HOVERED_ON);
                }
            } else {
                //thisflag_set_off(QEFLAG_CSS_LOOKED_AT);
                self.flag_set_off(QEFLAG_CSS_HOVERED_ON);
            }
        };
        window.onmouseover = this._events[QEEVENT_ON_WINDOW_MOUSE_OVER];
    },

    _initialize_controls: function() {
        this.left_click_timer.start();

        // I N P U T {mouse}
        document.addEventListener('mousemove', this.on_mouse_move.bind(this), true);
        document.addEventListener('mousedown', this.on_mouse_down.bind(this), true);
        document.addEventListener('mouseup'  , this.on_mouse_up.bind(this)  , true);

        // Base code modified from : https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
        if ('onwheel' in document) {
            document.addEventListener('wheel', function(event) {
                if (this.player.has_input()) {
                    /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                    this.manager_world.on_wheel_event((event.deltaY >> 10) || 1);
                }
                // event.preventDefault(); --> "Unable to preventDefault inside passive event listener invocation.".
                event.stopPropagation();
            }.bind(this), {
                capture: true,
                passive: true
            });
        } else {
            document.addEventListener('mousewheel', function(event) {
                if (this.player.has_input()) {
                    /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
                    this.manager_world.on_wheel_event((-event.wheelDelta >> 10) || 1);
                }
                // event.preventDefault(); --> "Unable to preventDefault inside passive event listener invocation.".
                event.stopPropagation();
            }.bind(this), {
                capture: true,
                passive: true
            });
        }

        // I N P U T {keyboard}
        document.addEventListener('keydown', this.on_key_down.bind(this), true);
        document.addEventListener('keyup'  , this.on_key_up.bind(this)  , true);
        document.addEventListener('paste'  , this.on_paste.bind(this)   , true);
        this.player.initialize_player_controls();
    },

    // Step : 0x1
    _initialize_for_first_render: function() {
        this.pause_sub_title.update_text('creating worlds');

        this.manager_world.__init__();

        this.initialize_shaders(this.manager_world.first_world);

        this._initialize_controls();

        //
        this.set_state(QEFLAG_STATE_RUNNING);
        //

        this.manager_world.set_current_world(this.manager_world.first_world);

        // Perform one psedu engine loop.
        this.manager_world.physics(this._cachef[QECACHEF_FPS_PHYSICS]);
        this.manager_world.update(this._cachef[QECACHEF_FPS_PHYSICS]);
        this.render(this._cachef[QECACHEF_FPS_PHYSICS]);
        //

        this.set_state(QEFLAG_STATE_PAUSED);
        this.player._initialize_state(PLAYER_STATE_FULL_CONTROL);

        // Connect to websockets.
        this.manager_web_sockets = new $_QE.prototype.WebSocketManager(this);

        this.application.engine_started();

        l('Engine loaded in {' + this.engine_init_time.getElapsedTime() + '}');

        this.engine_main_loop();
    },

    // M A T H.

    /**
     * @reference: https://stackoverflow.com/questions/30924280/what-is-the-best-way-to-determine-if-a-given-number-is-a-power-of-two
     * @param n
     * @returns {*|boolean}
     */
    math_is_power_of_two: function(n) {
        return n && !(n & (n - 1));
    },

    /**
     * @reference: https://stackoverflow.com/questions/4398711/round-to-the-nearest-power-of-two
     * @param n
     * @returns {*}
     */
    math_get_nearest_power_of_two: function(n) {
        let v = n;
        v--;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        v++; // next power of 2
        let x = v >> 1; // previous power of 2
        return (v - n) > (n - x) ? x : v;
    },

    // L O G G I N G.

    error: function(message, error_object=null) {
        this._log_history['error'].push([message, error_object]);
        if (error_object !== null) {
            l('----- Error Object -----');
            l(error_object);
        }
        l('----- Error Message -----');
        l(message);
        l('-------------------------');
        this.hud_chat.add_message_error(message);
        this.pause_menu_show_error('Error ' + EMOJI_ERROR, message);
        throw {
            name   : 'CustomException',
            message: message
        };
    },

    warning: function(message, data) {
        this._log_history['warnings'].push([message, data]);
        w('Warning: ' + message);
        this.hud_chat.add_message_warning(message);
        if (data !== null) {
            l(data);
            l('-------------------------');
        }
    },

    // L A Z Y - L O A D I N G

    /**
     * On the first image drag and drop event, load the needed objects and function callbacks.
     * @private
     */
    _lazy_load_drag_and_drop: function() {
        let self             = this;
        this._ei_file_reader = new FileReader();

        this._ei_file_reader.onload = function(event) {
            switch (self._ei_current_file_type) {
                case IMAGE_TYPE_WEBP:
                case IMAGE_TYPE_PNG:
                case IMAGE_TYPE_JPEG:
                    // Create a floating picture for image files.
                    self.manager_world.current_world.handle_image_upload(event.target.result, self._ei_queue_file[0].name);
                    break;
                default:
                    self.warning('Invalid file format {' + self._ei_current_file_type + '}', self._ei_queue_file[0]);
            }

            // If image process queue is not empty, process next one.
            if (self._ei_queue_file.length !== 1) {
                self._ei_queue_file[0]     = self._ei_queue_file.pop();
                self._ei_current_file_type = self._ei_queue_file[0].type;
                self._ei_file_reader.readAsDataURL(self._ei_queue_file[0]);
            } else {
                self._ei_queue_file[0]     = null;
                self._ei_current_file_type = null;
            }
            return false;
        };
    },

    // U T I L I T I E S.
    /**
     * @reference: https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
     * @param canvas     < The DOM Canvas element to save as an image. >
     * @param image_name < The name of the file to save as.            >
     */
    download_canvas: function(canvas, image_name) {
        this._canvas_saver.setAttribute('download', image_name + '.png');
        // The second replace prevents a DOM 18 exception.
        this._canvas_saver.setAttribute('href'    , canvas.toDataURL(IMAGE_TYPE_PNG).replace(IMAGE_TYPE_PNG, IMAGE_TYPE_OCTET_STREAM));
        this._canvas_saver.click();
    },
};


/*
$_QE.prototype._Text2DHelper = function(engine) {
    this.engine         = engine;
    this.text_alignment = TEXT_ALIGNMENT_START;
    this.font           = engine.FONT_ARIAL_12;
    this.__init__internal_canvas();

    this.set_canvas_dimensions(2, 2);
    this._context       = this._element.getContext('2d');

    this._set_font(engine.FONT_ARIAL_12);
};

Object.assign(
    $_QE.prototype._Text2DHelper.prototype,
    $_QE.prototype.DomCanvas.prototype,
    $_QE.prototype.CanvasRendererText.prototype,
    $_QE.prototype.FeatureSize.prototype,
    {
        get_text_width: function(text, font) {
            this._set_font(font);
            return this._context.measureText(text).width;
        },
    }
);

 */