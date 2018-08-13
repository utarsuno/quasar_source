'use strict';

// TODO : MAKE SURE TO NEVER RENDER AT A SUB-PIXEL! ONLY WHOLE-NUMBERS!

$_QE.prototype.CanvasRendering = function() {

    //this.context.fillStyle = '#' + this.current_foreground_color.getHexString();
    //this.context.fillStyle = '#' + this.current_foreground_color.getHexString();
    //this.context.strokeStyle = '#' + this.current_foreground_color.getHexString();
    //this.context.fillRect(0, 0, this._canvas_width, this._canvas_height);

    this.post_render = function() {
        if (is_defined(this.material)) {
            this.material.needsUpdate = true;
        }
        if (is_defined(this.texture)) {
            this.texture.needsUpdate = true;
        }
    };

    this.render = function() {
        this._render();
        this.post_render();
        this._post_render();
    };

    this.update = function() {
        if (this._render_needed()) {
            this.render();
            return true;
        }
        return false;

    };
};
