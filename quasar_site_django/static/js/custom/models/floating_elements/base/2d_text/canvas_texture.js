'use strict';

function CanvasTexture() {
    this.__init__();
}

CanvasTexture.prototype = {
    __init__: function(width, height) {
        // Inherit.
        CanvasAbstraction.call(this);
        this.set_dimensions(width, height);
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

    set_to_fixed_width: function() {
        this.temp = 2;
    },
};
