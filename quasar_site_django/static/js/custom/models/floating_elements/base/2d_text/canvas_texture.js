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

    render: function(background_color, foreground_color, text) {
        this.context.clearRect(0, 0, this.width, this.height);
        if (is_defined(background_color)) {
            this.context.fillStyle = background_color;
            this.context.fillRect(0, 0, this.width, this.height);
        }
        this.context.fillStyle = foreground_color;

        if (this.text_property_centered) {
            this.context.textAlign = 'center';
            this.context.fillText(text, this.width / 2, int(this.font_size * .9));
        } else {
            this.context.fillText(text, 0, int(this.font_size * .9));
        }

        this.texture.needsUpdate = true;
    },

    set_to_fixed_width: function() {
        this.temp = 2;
    },
};
