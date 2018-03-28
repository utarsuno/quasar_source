'use strict';

const _SMUDGE_FACTOR = 0.75;

function CanvasAbstraction(width, height) {
    this.__init__(width, height);
}

// TODO : Add font options!
CanvasAbstraction.prototype = {
    __init__: function(width, height) {
        this.width     = get_nearest_power_of_two_for_number(width  * 2);
        this.height    = get_nearest_power_of_two_for_number(height * 2);

        this.canvas        = document.createElement('canvas');
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.context       = this.canvas.getContext('2d');
    },

    // TODO : Add font options!
    set_font: function(height) {
        if (is_defined(height)) {
            this.height = get_nearest_power_of_two_for_number(height * 2);
        }
        this.font_size    = int(this.height * _SMUDGE_FACTOR);
        this.font         = str(this.font_size) + 'px Arial';
        this.context.font = this.font;
    },

    initialize: function() {
        this.set_font();

        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();
        this.material = new THREE.MeshBasicMaterial({
            map : this.texture, transparent: true, side: THREE.FrontSide
        });
    },

    render: function(background_color, foreground_color, center_text, text) {
        this.context.clearRect(0, 0, this.width, this.height);
        if (is_defined(background_color)) {
            this.context.fillStyle = background_color;
            this.context.fillRect(0, 0, this.width, this.height);
        }
        this.context.fillStyle = foreground_color;
        this.context.fillText(text, 0, this.font_size);

        this.texture.needsUpdate = true;
    },

    get_text_width: function(text) {
        return this.context.measureText(text).width;
    }
};


/*
        var x_offset = 0;
        if (this.centered) {
            x_offset = this.texture_width / 2 - this._get_text_length() / 2;
        }
*/