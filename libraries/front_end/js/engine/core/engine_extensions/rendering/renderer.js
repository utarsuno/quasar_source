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
        },

        _update_renderer_dimensions() {
            this.camera.aspect = this._cachef[QECACHEF_ASPECT_RATIO];
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this._cachei[QECACHEI_WIDTH_INNER], this._cachei[QECACHEI_HEIGHT_INNER]);

            if (this.flag_is_on(QEFLAG_SETTING_SHADERS)) {
                this.effect_composer.setSize(this._cachei[QECACHEI_WIDTH_INNER], this._cachei[QECACHEI_HEIGHT_INNER]);
                this._update_fxaa();
                this._update_outline_glow();
                this._update_background();
            }
        },

        get_aspect_ratio: function() {
            return this._cachei[QECACHEI_WIDTH_INNER] / this._cachei[QECACHEI_HEIGHT_INNER];
        },

        /*        ___               __  ___
         | |\ | |  |  |  /\  |    |  / |__
         | | \| |  |  | /~~\ |___ | /_ |___*/
        // TODO: (as a test) --> #pre_process{function_inline}
        _add_three_js_canvas_to_window: function() {
            this.renderer.domElement.id = GLOBAL_ID_CANVAS_MAIN;
            document.body.appendChild(this.renderer.domElement);
        },

        _initialize_renderer: function() {
            this._cachef[QECACHEF_FOV]           = 75.0;
            this._cachef[QECACHEF_CLIPPING_NEAR] = 1.0;
            this._cachef[QECACHEF_CLIPPING_FAR]  = 17500.0;

            this.renderer     = new THREE.WebGLRenderer({antialias: false, alpha: false});
            this._add_three_js_canvas_to_window();

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this._cachei[QECACHEI_WIDTH_INNER], this._cachei[QECACHEI_HEIGHT_INNER]);
            this.renderer.setClearColor(0x252525);
            //this.renderer.setClearColor( 0x000000, 0 ); // the default
            this.renderer.autoClear = true;

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
            this.effect_composer = new THREE.EffectComposer(this.renderer);
            this.render_pass     = new THREE.RenderPass(world.scene, this.camera);

            //
            this.effect_composer.setSize(this._cachei[QECACHEI_WIDTH_INNER], this._cachei[QECACHEI_HEIGHT_INNER]);
            //
            this.effect_composer.addPass(this.render_pass);

            this._initialize_outline_glow(world);
            this._initialize_fxaa();
            this._initialize_noise();
            this._initialize_background();
        },

        // TODO: this will get replaced by the 'world_transition' file
        _on_new_scene_set: function(scene) {
            this.outline_pass.renderScene = scene;
            this.render_pass.scene        = scene;
        },
    }
);
