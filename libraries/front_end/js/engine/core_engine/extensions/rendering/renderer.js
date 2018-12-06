'use strict';


Object.assign(
    $_QE.prototype,
    {
        render: function(delta) {


            if (this.flag_is_on(QEFLAG_STATE_IN_TRANSITION)) {
                this._current_transition.render(delta);
            } else {
                this.effect_composer.render(delta);
            }


            //this.renderer.clearDepth();
            //this.renderer.render(this.manager_world.current_world.scene, this.camera);
            // TODO: Avoid updates when the world has no active CSS elements!
            this.css_renderer.render(this.css_scene, this.camera);

        },

        _update_renderer_dimensions() {
            if (this.effect_composer == null) {
                return;
            }

            this.camera.aspect = this._cachef[QECACHEF_ASPECT_RATIO];
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.get_width(), this.get_height());

            if (this.flag_is_on(QEFLAG_SETTING_SHADERS)) {
                this.effect_composer.setSize(this.get_width(), this.get_height());
                this._update_fxaa();
                this._update_outline_glow();
                if (this.flag_is_on(QEFLAG_SETTING_BACKGROUND_GRAY)) {
                    this._update_background();
                }
            }

            if (this.css_renderer != null) {
                this.css_renderer.setSize(this.get_width(), this.get_height());
            }
        },

        get_aspect_ratio: function() {
            return this.get_width() / this.get_height();
        },

        /*        ___               __  ___
         | |\ | |  |  |  /\  |    |  / |__
         | | \| |  |  | /~~\ |___ | /_ |___*/
        // TODO: (as a test) --> #pre_process{function_inline}
        _add_three_js_canvas_to_window: function() {
            this.renderer.domElement.id = GLOBAL_ID_CANVAS_MAIN;
            document.body.appendChild(this.renderer.domElement);
        },

        _initialize_renderer_shadows: function() {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
            this.renderer.shadowMapSoft     = true;

            //this.renderer.shadowMap.renderReverseSided = true;
            //this.renderer.shadowMap.renderSingleSided  = false; // default is true

            /*
            this.renderer.shadowCameraNear  = 2;
            this.renderer.shadowCameraFar   = 6000;
            this.renderer.shadowCameraFov   = 75;

            this.renderer.shadowMapBias = 0.0039;
            this.renderer.shadwMapDarkness = 0.85;
            this.renderer.shadowMapWidth   = 2048;
            this.renderer.shadowMapHeight  = 2048;
            */
        },

        _shader_disable_background_gray: function() {
            QE.flag_set_off(QEFLAG_SETTING_BACKGROUND_GRAY);
        },

        _shader_enable_background_gray: function() {
            QE.flag_set_on(QEFLAG_SETTING_BACKGROUND_GRAY);
        },

        _create_css_renderer: function(world) {
            this.css_renderer = new THREE.CSS3DRenderer();
            this.css_renderer.setSize(this.get_width(), this.get_height());
            this.css_scene = new THREE.Scene();

            //this.css_renderer.autoClear = false;
            //this.css_renderer.setClearColor( 0xffffff, 0);

            //
            this.css_renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.zIndex = 0;
            this.css_renderer.domElement.style.top = 0;
            this.css_renderer.domElement.style.zIndex = 5000;
            document.body.appendChild(this.css_renderer.domElement);
            //this.css_renderer.domElement.appendChild(this.renderer.domElement);
            //
            this.css_renderer.domElement.id = 'GLOBAL_CSS';
        },

        __init__renderer: function() {
            this._cachef[QECACHEF_FOV]           = 95.0;
            this._cachef[QECACHEF_CLIPPING_NEAR] = 1.0;
            this._cachef[QECACHEF_CLIPPING_FAR]  = 50000.0;

            this.renderer     = new THREE.WebGLRenderer({antialias: false, alpha: false});
            this._add_three_js_canvas_to_window();

            this._initialize_renderer_shadows();

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.get_width(), this.get_height());
            this.renderer.setClearColor(0x252525);
            //this.renderer.setClearColor( 0x000000, 0 ); // the default
            //this.renderer.autoClear = true;
            //this.renderer.autoClear = false;

            //
            // TODO: eventually switch this to false
            this.renderer.sortObjects = true;
            //

            this.camera = new THREE.PerspectiveCamera(
                this._cachef[QECACHEF_FOV],
                this._cachef[QECACHEF_ASPECT_RATIO],
                this._cachef[QECACHEF_CLIPPING_NEAR],
                this._cachef[QECACHEF_CLIPPING_FAR]
            );
        },

        initialize_shaders: function(world) {
            this._create_css_renderer(world);

            //
            //this.render_pass_css     = new THREE.RenderPass(this.css_scene, this.camera);
            //

            this.effect_composer = new THREE.EffectComposer(this.renderer);
            this.render_pass     = new THREE.RenderPass(world.scene, this.camera);

            //
            this.effect_composer.setSize(this.get_width(), this.get_height());
            //
            this.effect_composer.addPass(this.render_pass);

            this._initialize_outline_glow(world);
            this._initialize_fxaa();
            this._initialize_noise();
            this._initialize_background();

            this.effect_noise.clear      = false;
            this.effect_noise.clearDepth = true;
        },

        // TODO: this will get replaced by the 'world_transition' file
        _on_new_scene_set: function(scene) {
            this.outline_pass.renderScene = scene;
            this.render_pass.scene        = scene;
        },
    }
);
