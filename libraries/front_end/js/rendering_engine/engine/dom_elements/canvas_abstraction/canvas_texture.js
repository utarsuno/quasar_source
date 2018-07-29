'use strict';

$_QE.prototype.CanvasTexture = function(canvas, font) {
    this.canvas = canvas;
    this.canvas_font = font;

    this.initialize_texture = function() {
        this.context = this.canvas.getContext('2d');
        if (is_defined(this.canvas_font)) {
            this.context.font = this.canvas_font[0];
            this.canvas_font_size = this.canvas_font[CANVAS_FONT_INDEX_SIZE];
            this.canvas_font_offset = this.canvas_font[CANVAS_FONT_INDEX_OFFSET];
        }
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = QE.manager_renderer.renderer.capabilities.getMaxAnisotropy();
        //this.texture.f
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_width = function(text) {
        return this.context.measureText(text).width;
    };
};
