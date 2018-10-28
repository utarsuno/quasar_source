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

        _initialize_renderer: function() {
            this._cache_floats[ENGINE_FLOAT_FOV]           = 75.0;
            this._cache_floats[ENGINE_FLOAT_CLIPPING_NEAR] = 1.0;
            this._cache_floats[ENGINE_FLOAT_CLIPPING_FAR]  = 17500.0;

            this.renderer     = new THREE.WebGLRenderer({antialias: false, alpha: false});

            this.renderer_dom = new $_QE.prototype.DomElement().set_from_canvas(this.renderer.domElement);
            this.renderer_dom.set_id(GLOBAL_ID_CANVAS_MAIN);
            this.renderer_dom.append_to_document_body();

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);
            this.renderer.setClearColor(0x252525);
            //this.renderer.setClearColor( 0x000000, 0 ); // the default
            this.renderer.autoClear = true;

            this.camera = new THREE.PerspectiveCamera(
                this._cache_floats[ENGINE_FLOAT_FOV],
                this._cache_floats[ENGINE_FLOAT_ASPECT_RATIO],
                this._cache_floats[ENGINE_FLOAT_CLIPPING_NEAR],
                this._cache_floats[ENGINE_FLOAT_CLIPPING_FAR]
            );
        },

        _update_renderer_dimensions() {
            this.camera.aspect = this._cache_floats[ENGINE_FLOAT_ASPECT_RATIO];
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);

            if (this.get_flag(ENGINE_SETTING_STATE_SHADERS)) {
                this.effect_composer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);
                if (this.get_flag(ENGINE_SETTING_STATE_FXAA)) {
                    this.effect_FXAA.uniforms['resolution'].value.set(1 / (this._cache_values[ENGINE_CACHE_WIDTH_INNER] * window.devicePixelRatio), 1 / (this._cache_values[ENGINE_CACHE_HEIGHT_INNER] * window.devicePixelRatio));
                }
                //this.outline_pass.setSize(this.window_width, this.window_height);
                this.outline_pass.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);
            }
        },

        initialize_shaders: function(world) {
            //this.load_transition_material();
            this.effect_composer = new THREE.EffectComposer(this.renderer);
            this.render_pass     = new THREE.RenderPass(world.scene, this.camera);

            //
            this.effect_composer.setSize(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]);
            //

            this.effect_composer.addPass(this.render_pass);

            this.effect_FXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effect_FXAA.uniforms['resolution'].value.set(1 / (this._cache_values[ENGINE_CACHE_WIDTH_INNER] * window.devicePixelRatio), 1 / (this._cache_values[ENGINE_CACHE_HEIGHT_INNER] * window.devicePixelRatio));

            this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this._cache_values[ENGINE_CACHE_WIDTH_INNER], this._cache_values[ENGINE_CACHE_HEIGHT_INNER]), world.scene, this.camera);
            this.effect_composer.addPass(this.outline_pass);

            // Make sure FXAA gets added after outline pass and before the film effect.
            this.effect_composer.addPass(this.effect_FXAA);

            this.effect_film = new $_QE.prototype.FilmNoise();
            this.effect_film.renderToScreen = true;
            this.effect_composer.addPass(this.effect_film);

            this._initialize_outline_glow(world);
        },

    }
);
