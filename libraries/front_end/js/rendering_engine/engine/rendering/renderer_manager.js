'use strict';

$_QE.prototype.RendererManager = function(client, engine) {
    this.field_of_view = 75;
    this.near_clipping = 1.0;
    this.far_clipping  = 20000.0;
    this.aspect_ratio  = null;
    this.client        = client;
    this.engine        = engine;

    this.pre_render_initialize = function() {
        this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: false});

        this.renderer_dom = new $_QE.prototype.DomElement(this.renderer.domElement, DOM_ELEMENT_CONSTRUCTOR_TYPE_ELEMENT, DOM_ELEMENT_CANVAS);
        this.renderer_dom.set_id('canvas_id');
        this.renderer_dom.append_to_document_body();

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.client.state_window_width_inner, this.client.state_window_height_inner);
        this.renderer.setClearColor(0x252525);

        this.renderer.autoClear = true;

        this.aspect_ratio = this.client.state_window_width_inner / this.client.state_window_height_inner;

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
        if (this.in_transition) {
            this._current_transition.render(delta);
        } else {
            this.effect_composer.render(delta);
        }
    };

    this._resize_event_shader = function() {
        if (this.engine.engine_setting_shaders_enabled) {
            this.effect_composer.setSize(this.client.state_window_width_inner, this.client.state_window_height_inner);
            if (this.engine.engine_setting_shader_fxaa_enabled) {
                this.effect_FXAA.uniforms['resolution'].value.set(1 / this.client.state_window_width_inner, 1 / this.client.state_window_height_inner);
            }
            if (this.engine.engine_setting_shader_outline_enabled) {
                //this.outline_glow.outline_pass.setSize(this.window_width, this.window_height);
            }
            if (this.engine.engine_setting_shader_grain_enabled) {
                //
            }
        }
    };

    this.window_resize_event = function() {
        //this.aspect_ratio = this.client.state_window_width_inner / this.client.state_window_height_inner;
        //this.camera.aspect = this.aspect_ratio;
        this.camera.aspect = this.client.state_window_width_inner / this.client.state_window_height_inner;
        this.camera.updateProjectionMatrix();

        this.camera_frustum_height = this.camera.getFilmHeight() * this.camera.aspect;
        this.camera_frustum_width  = this.camera.getFilmWidth() / this.camera.aspect;


        this.renderer.setSize(this.client.state_window_width_inner, this.client.state_window_height_inner);

        this._resize_event_shader();
    };

    this.initialize_shaders = function(world) {
        this.effect_composer = new THREE.EffectComposer(this.renderer);
        this.render_pass = new THREE.RenderPass(world.scene, this.camera);
        this.effect_composer.addPass(this.render_pass);

        //if (this.engine.engine_setting_shader_fxaa_enabled) {
        //}

        this.effect_FXAA = new THREE.ShaderPass(THREE.FXAAShader);
        this.effect_FXAA.uniforms['resolution'].value.set(1 / this.window_width, 1 / this.window_height);
        //this.effect_FXAA.renderToScreen = true;
        this.effect_composer.addPass(this.effect_FXAA);

        //this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this.window_width, this.window_height), world.scene, this.camera);
        //this.effect_composer.addPass(this.outline_pass);

        this.effect_film = new $_QE.prototype.FilmNoise();
        this.effect_film.renderToScreen = true;
        this.effect_composer.addPass(this.effect_film);

        //this.outline_glow = new OutlineGlow(this.outline_pass);


        //this.outline_glow.outline_pass.renderScene = world.scene;
        this.render_pass.scene = world.scene;

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
