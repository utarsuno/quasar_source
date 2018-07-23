'use strict';

$_QE.prototype.CanvasTexture = function(canvas) {
    this.canvas = canvas;

    this.on_post_render = function() {
        if (is_defined(this.material)) {
            this.material.needsUpdate = this;
        }
    };

    this.initialize_texture = function() {
        this.context = this.canvas.getContext('2d');
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = QE.manager_renderer.renderer.capabilities.getMaxAnisotropy();
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_width = function(text) {
        return this.context.measureText(text).width;
    };
};
