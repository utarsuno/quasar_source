$_QE.prototype.FloatingCSSWall = function(args) {
    this.__init__floating_css_wall(args);
};

Object.assign(
    $_QE.prototype.FloatingCSSWall.prototype,
    $_QE.prototype.WallFloating.prototype,
    {
        create: function() {
            this.create_wall_mesh(FEATURE_MATERIAL_COLOR_FANCY);

            this.set_event(ELEMENT_EVENT_ON_LOOK_AT, function() {
                QE.flag_set_on(QEFLAG_CSS_LOOKED_AT);
                QE.mouse_release();
            }.bind(this), '0');

            this.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, function() {
                QE.mouse_lock();
                QE.flag_set_off(QEFLAG_CSS_LOOKED_AT);
                QE.flag_set_off(QEFLAG_CSS_HOVERED_ON);
                document.activeElement.blur();
            }.bind(this), '0');


            this.add_title_bar(null, ASSET_ICON_VIDEO, true, true, true);
            //this._default_row = this.create_row_interactive(0.5);
        },

        matches_css_object: function(o) {
            return o === this.div || o === this.div.parentElement;
        },

        on_pause_state: function() {
            this.div.parentElement.parentElement.style.position = '';
        },

        on_resume_state: function() {
            this.div.parentElement.parentElement.style.position = 'absolute';
        },

        __init__floating_css_wall: function(args) {
            this._cache_css_look_at = new THREE.Vector3();

            this.__init__floating_rows(EFLAG_IS_CSS);
            this.set_dimensions(args[ARG_WIDTH], args[ARG_HEIGHT]);
            this.set_foreground_color(QE.COLOR_GRAY_DARK);
            this.set_background_color(QE.COLOR_BLUE);
            $_QE.prototype.FeatureInteractive.call(this);
            this.flag_set_off(EFLAG_IS_ENGABLE);
            //this.flag_set_on(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING);
            //this.flag_set_on(EFLAG_IS_MOUSE_MOVABLE);
            //this.flag_set_on(EFLAG_IS_MOUSE_SCALABLE);

            if (this._arg_is_on(args, ARG_CSS_WEBSITE)) {
                this.___init__floating_css_website(args);
            } else if (this._arg_is_on(args, ARG_CSS_VIDEO)) {
                this.___init__floating_css_youtube(args);
            } else if (this._arg_is_on(args, ARG_CSS_TRAIDER)) {
                this.___init__floating_css_traider(args);
            }

            this._parse_arguments_on_constructor_end_floating_element(args);
        },

        ___init__floating_wall_start: function() {
            // TODO: Create clean-up functions/abstractions for dom nodes.
            this.div = document.createElement('div');
        },

        ___init__floating_wall_end: function() {
            this.css_object = new THREE.CSS3DObject(this.div);
            QE.css_scene.add(this.css_object);

            this.div.addEventListener('mousemove' , QE.get_event_callback(QEEVENT_ON_WINDOW_MOUSE_OVER));
            this.div.addEventListener('mouseenter', QE.get_event_callback(QEEVENT_ON_WINDOW_MOUSE_OVER));
            this.div.addEventListener('mouseover' , QE.get_event_callback(QEEVENT_ON_WINDOW_MOUSE_OVER));
        },

        ___init__floating_css_traider: function() {
            this.div = document.getElementById('trAidr');
            this.___init__floating_wall_end();
        },

        ___init__floating_css_website: function(args) {
            let html = [
                '<div style="width:' + args[ARG_WIDTH] + 'px; height:' + args[ARG_HEIGHT] + 'px;">',
                '<iframe src="' + args[ARG_URL] + '" width="' + args[ARG_WIDTH] + '" height="' + args[ARG_HEIGHT] + '">',
                '</iframe>',
                '</div>'
            ].join('\n');
            this.___init__floating_wall_start();
            this.div.innerHTML = html;
            this.___init__floating_wall_end();
        },

        ___init__floating_css_youtube: function(args) {
            this.___init__floating_wall_start();
            this.iframe              = document.createElement('iframe');
            this.iframe.style.width  = args[ARG_WIDTH].toString() + 'px';
            this.iframe.style.height = args[ARG_HEIGHT].toString() + 'px';
            this.iframe.style.border = '0px';
            // iv_load_policy=3 --> disables video annotations (turned off for now to see any performance difference)
            this.iframe.src          = ['https://www.youtube-nocookie.com/embed/', args[ARG_URL], '?rel=1&theme=dark&iv_load_policy=3'].join( '' );
            this.div.appendChild(this.iframe);
            this.___init__floating_wall_end();
        },

        css_wall_hide: function() {

        },
    }

);
