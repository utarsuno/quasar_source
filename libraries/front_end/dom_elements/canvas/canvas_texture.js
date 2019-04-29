'use strict';

$_QE.prototype.DomCanvasTexture = function() {};

Object.assign(
    $_QE.prototype.DomCanvasTexture.prototype,
    $_QE.prototype.DomCanvas.prototype,
    {
        __init__canvas_texture: function(args) {
            //l(args);

            this.__init__internal_canvas();
            this.__init__renderer_text(args);
            this._set_context();


            //this._set_context();
            //this.set_canvas_font(font);


            // this._set_texture();
            //
            this.texture = new THREE.Texture(this._element);
            // TODO: Based off distance to player.
            //this.texture.magFilter = THREE.NearestFilter;
            //this.texture.minFilter = THREE.NearestFilter;
            this.texture.anisotropy = QE.renderer.capabilities.getMaxAnisotropy();

            // Investigate this?
            if (this.height !== this._canvas_height || this.width !== this._canvas_width) {
                l('Investigate this! {' + this.height + '} {' + this._canvas_height + '} {' + this.width + '} {' + this._canvas_width + '}');
                this.texture.repeat.set(this.width / this._canvas_width, this.height / this._canvas_height);
                this.texture.offset.y = 1.0 - (this.height / this._canvas_height);
            }
        },

        _set_context: function() {
            if (!QE.is_power_of_two(this.width)) {
                this.set_canvas_width(QE.get_nearest_power_of_two_for_number(this.width * 2));
            } else {
                this.set_canvas_width(this.width);
            }
            if (!QE.is_power_of_two(this.height)) {
                this.set_canvas_height(QE.get_nearest_power_of_two_for_number(this.height * 2));
            } else {
                this.set_canvas_height(this.height);
            }

            if (this.font != null) {
                this.set_canvas_font(this.font);
            }
        },

    }
);
