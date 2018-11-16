'use strict';

Object.assign(
    $_QE.prototype,
    {
        hover_color         : new THREE.Color(0x88ecff),
        engage_color        : new THREE.Color(0x28ff8e),
        current_hover_object: null,

        _update_outline_glow: function() {
            this.outline_pass.setSize(this._cachei[QECACHEI_WIDTH_INNER], this._cachei[QECACHEI_HEIGHT_INNER]);
        },

        _initialize_outline_glow: function(world) {
            this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this._cachei[QECACHEI_WIDTH_INNER], this._cachei[QECACHEI_HEIGHT_INNER]), world.scene, this.camera);
            this.effect_composer.addPass(this.outline_pass);

            this.outline_pass.edgeStrength      = 4.5;
            this.outline_pass.edgeGlow          = 0.2;
            this.outline_pass.edgeThickness     = 1.5;
            this.outline_pass.pulsePeriod       = 5.0;
            this.outline_pass.usePatternTexture = false;
            this.outline_pass.hiddenEdgeColor   = QE.COLOR_BLACK;
            this.outline_pass.selectedObjects   = [];
            this.outline_pass.renderScene       = world.scene;

            this.set_to_hover_color();
        },

        set_to_engage_color: function() {
            this.outline_pass.visibleEdgeColor = this.engage_color;
            //this.outline_pass.hiddenEdgeColor  = this.engage_color;
        },

        set_to_hover_color: function() {
            this.outline_pass.visibleEdgeColor = this.hover_color;
            //this.outline_pass.hiddenEdgeColor  = this.hover_color;
        },

        set_hover_object: function(object) {
            this.current_hover_object = object;
            this.outline_pass.selectedObjects[0] = this.current_hover_object;
            //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_HOVER);
        },

        remove_hover_object: function(object) {
            if (this.current_hover_object == object) {
                this.remove_current_object();
            }
        },

        remove_current_object: function() {
            this.outline_pass.selectedObjects = [];
            this.current_hover_object         = null;
        },
    }
);
