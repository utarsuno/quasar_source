'use strict';


Object.assign(
    $_QE.prototype,
    {
        render: function(delta) {
            if (this.get_flag(ENGINE_STATE_IN_TRANSITION)) {
                this._current_transition.render(delta);
            } else {
                this.effect_composer.render(delta);
            }
        },

        _update_renderer_dimensions() {
            this.camera.aspect = this._cache_floats[ENGINE_FLOAT_ASPECT_RATIO];
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);

            if (this.get_flag(ENGINE_SETTING_STATE_SHADERS)) {
                this.effect_composer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);
                this._update_fxaa();
                this._update_outline_glow();
                this._update_background();
            }
        },

        get_aspect_ratio: function() {
            return this._cache_values[ENGINE_CACHE_WIDTH_INNER] / this._cache_values[ENGINE_CACHE_HEIGHT_INNER];
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
            this._cache_floats[ENGINE_FLOAT_FOV]           = 75.0;
            this._cache_floats[ENGINE_FLOAT_CLIPPING_NEAR] = 1.0;
            this._cache_floats[ENGINE_FLOAT_CLIPPING_FAR]  = 17500.0;

            this.renderer     = new THREE.WebGLRenderer({antialias: false, alpha: false});
            this._add_three_js_canvas_to_window();

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);
            this.renderer.setClearColor(0x252525);
            //this.renderer.setClearColor( 0x000000, 0 ); // the default
            this.renderer.autoClear = true;

            //
            // TODO: eventually switch this to false
            this.renderer.sortObjects = true;
            //

            this.camera = new THREE.PerspectiveCamera(
                this._cache_floats[ENGINE_FLOAT_FOV],
                this._cache_floats[ENGINE_FLOAT_ASPECT_RATIO],
                this._cache_floats[ENGINE_FLOAT_CLIPPING_NEAR],
                this._cache_floats[ENGINE_FLOAT_CLIPPING_FAR]
            );
        },

        initialize_shaders: function(world) {
            this.effect_composer = new THREE.EffectComposer(this.renderer);
            this.render_pass     = new THREE.RenderPass(world.scene, this.camera);

            //
            this.effect_composer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);
            //
            this.effect_composer.addPass(this.render_pass);

            this._initialize_outline_glow(world);
            this._initialize_fxaa();
            this._initialize_noise();
            this._initialize_background();
        },

    }
);
