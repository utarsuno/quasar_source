'use strict';

$_QE.prototype.OutlineGlow = function(outline_pass) {
    this.outline_pass = outline_pass;
    this.outline_pass.edgeStrength  = 4.5;
    this.outline_pass.edgeGlow      = 0.2;
    this.outline_pass.edgeThickness = 1.5;
    this.outline_pass.pulsePeriod   = 5.0;
    this.outline_pass.usePatternTexture = false;

    //
    this.outline_pass.hiddenEdgeColor  = QE.COLOR_BLACK;

    this.outline_pass.selectedObjects = [];

    this.hover_color = new THREE.Color(0x88ecff);
    this.engage_color = new THREE.Color(0x28ff8e);

    this.set_to_engage_color = function() {
        this.outline_pass.visibleEdgeColor = this.engage_color;
        //this.outline_pass.hiddenEdgeColor  = this.engage_color;
    };

    this.set_to_hover_color = function() {
        this.outline_pass.visibleEdgeColor = this.hover_color;
        //this.outline_pass.hiddenEdgeColor  = this.hover_color;
    };

    this.set_hover_object = function(object3D) {
        this.current_hover_object = object3D;
        this.outline_pass.selectedObjects[0] = this.current_hover_object;
        //MANAGER_AUDIO.play_sound(AUDIO_SOUND_ON_HOVER);
    };

    this.remove_hover_object = function(object3D) {
        if (this.current_hover_object === object3D) {
            this.remove_current_object();
        }
    };

    this.remove_current_object = function() {
        // slower way, this.outline_pass.selectedObjects.length = 0;
        this.outline_pass.selectedObjects = [];
        this.current_hover_object = null;
    };

    this.set_to_hover_color();

    this.current_hover_object = null;
};
