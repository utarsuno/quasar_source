'use strict';

$_QE.prototype.CanvasAbstraction = function() {
    // Inherit.
    $_QE.prototype.CanvasFont.call(this);
    this.canvas  = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    /*

$_QE.prototype.CanvasTexture = function() {
    // Inherit.
    $_QE.prototype.CanvasAbstraction.call(this);

    this.initialize = function() {
        this.set_font();
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = QE.renderer.renderer.capabilities.getMaxAnisotropy();
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

     */

    this.clear = function(background_color) {
        this.context.clearRect(0, 0, this.width, this.height);
        if (is_defined(background_color)) {
            this.context.fillStyle = background_color;
            this.context.fillRect(0, 0, this.width, this.height);
        }
    };

    this.pre_render = function(background_color, foreground_color) {
        this.clear(background_color);
        this.context.fillStyle = foreground_color;
    };

    this.render = function(background_color, foreground_color, text) {
        this.pre_render(background_color, foreground_color);

        if (this.text_property_centered) {
            this.context.textAlign = 'center';
            this.context.fillText(text, this.width / 2, Math.floor(this.font_size * .9));
        } else {
            this.context.fillText(text, 0, Math.floor(this.font_size * .9));
        }
    };

    this.render_rows = function(background_color, foreground_color, rows) {
        this.pre_render(background_color, foreground_color);

        let r;
        for (r = 0; r < rows.length; r++) {
            //l('Rendering content {' + rows[r].content + '}');
            this.context.fillText(rows[r].content, 0, Math.floor(this.font_size * .9) * r);
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_width = function(text) {
        return this.context.measureText(text).width;
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_dimensions = function(width, height) {
        this._set_width(width);
        this._set_height(height);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    };

    this._set_height = function(height) {
        this.height = get_next_highest_power_of_two(height * 2);
    };

    this._set_width = function(width) {
        //this.width = get_next_highest_power_of_two(width * 2);
        this.width = get_next_highest_power_of_two(width * 2);
    };
};
