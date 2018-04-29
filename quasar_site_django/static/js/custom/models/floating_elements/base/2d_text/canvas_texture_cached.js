'use strict';

function CanvasTextureCached() {
    this.__init__();
}

CanvasTextureCached.prototype = {
    __init__: function() {
        // Inherit.
        CanvasAbstraction.call(this);

        this._width_set = false;
        this._height_set = false;
        this._text_set   = false;
        this._ratio_set  = false;
        this._foreground_color_set = false;
    },

    initialize: function() {
        this.set_font();
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();
    },

    update: function(background_color, foreground_color, text) {
        if (this._foreground_color_set === false) {
            this._foreground_color_set = true;

            this.render(background_color, foreground_color, text);
            this.texture.needsUpdate = true;
        }
    },

    modify_canvas: function(width, height) {
        this.set_dimensions(width, height);
        this.set_font();
    }
};
