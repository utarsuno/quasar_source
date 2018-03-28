'use strict';

function OutlineGlow(outline_pass) {
    this.__init__(outline_pass);
}

OutlineGlow.prototype = {

    __init__: function(outline_pass) {
        this.outline_pass = outline_pass;
        this.outline_pass.edgeStrength  = 4.5;
        this.outline_pass.edgeGlow      = 0.2;
        this.outline_pass.edgeThickness = 1.5;
        this.outline_pass.pulsePeriod   = 5.0;
        this.outline_pass.usePatternTexture = false;

        this.hover_color = new THREE.Color(0x88ecff);
        this.engage_color = new THREE.Color(0x28ff8e);

        this.set_to_hover_color();

        this.current_hover_object = null;
    },

    set_to_engage_color: function() {
        this.outline_pass.visibleEdgeColor = this.engage_color;
        this.outline_pass.hiddenEdgeColor  = this.engage_color;
    },

    set_to_hover_color: function() {
        this.outline_pass.visibleEdgeColor = this.hover_color;
        this.outline_pass.hiddenEdgeColor  = this.hover_color;
    },

    set_hover_object: function(object3D) {
        this.current_hover_object = object3D;
        this.outline_pass.selectedObjects = [this.current_hover_object];
    },

    remove_hover_object: function(object3D) {
        if (this.current_hover_object === object3D) {
            this.remove_current_object();
        }
    },

    remove_current_object: function() {
        this.outline_pass.selectedObjects = [];
        this.current_hover_object = null;
    }

};