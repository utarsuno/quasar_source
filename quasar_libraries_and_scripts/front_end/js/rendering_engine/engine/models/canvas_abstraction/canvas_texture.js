'use strict';

$_QE.prototype.CanvasTexture = function() {
    // Inherit.
    $_QE.prototype.CanvasAbstraction.call(this);
    
    this.initialize = function() {
        this.set_font();
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = QE.manager_renderer.renderer.capabilities.getMaxAnisotropy();
    };

    //this.update = function(background_color, foreground_color, text) {
    //    this.render(background_color, foreground_color, text);
    //    this.texture.needsUpdate = true;
    //};

    this.modify_canvas = function(width, height) {
        this.set_dimensions(width, height);
        this.set_font();
    };
};
