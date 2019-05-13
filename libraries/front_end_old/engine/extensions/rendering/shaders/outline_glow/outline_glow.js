Object.assign(
    $_QE.prototype,
    {
        _update_outline_glow: function() {
            this.outline_pass.setSize(this.get_width(), this.get_height());
        },

        _initialize_outline_glow: function(world) {
            this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this.get_width(), this.get_height()), world.scene, this.camera);
            this.effect_composer.addPass(this.outline_pass);

            this.outline_pass.edgeStrength      = 4.5;
            this.outline_pass.edgeGlow          = 0.2;
            this.outline_pass.edgeThickness     = 1.5;
            this.outline_pass.pulsePeriod       = 5.0;
            this.outline_pass.usePatternTexture = false;
            this.outline_pass.hiddenEdgeColor   = QE.COLOR_BLACK;
            this.outline_pass.selectedObjects   = [];
            this.outline_pass.renderScene       = world.scene;

            this.outline_glow_set_state_hover();
        },

        outline_glow_set_state_engaged: function() {
            this.outline_pass.visibleEdgeColor = this.COLOR_GLOW_ENGAGED;
            //this.outline_pass.hiddenEdgeColor  = this.engage_color;
        },

        outline_glow_set_state_hover: function() {
            this.outline_pass.visibleEdgeColor = this.COLOR_GLOW_HOVER;
            //this.outline_pass.hiddenEdgeColor  = this.hover_color;
        },

        outline_glow_set_target: function(object) {
            this.outline_pass.selectedObjects[0] = object;
            //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_HOVER);
        },

        outline_glow_clear_target: function() {
            this.outline_pass.selectedObjects = [];
        },
    }
);
