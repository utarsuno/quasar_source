'use strict';

function CanvasTexture() {
    this.__init__();
}

CanvasTexture.prototype = {
    __init__: function() {
        // Inherit.
        CanvasAbstraction.call(this);
    },

    initialize: function() {
        this.set_font();
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();
    },

    update: function(background_color, foreground_color, text) {
        this.render(background_color, foreground_color, text);
        this.texture.needsUpdate = true;
    },

    modify_canvas: function(width, height) {
        this.set_dimensions(width, height);
        this.set_font();
    }
};
