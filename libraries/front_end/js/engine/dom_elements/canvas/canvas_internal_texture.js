'use strict';

$_QE.prototype.DomCanvasInternalTexture = function() {};

Object.assign(
    $_QE.prototype.DomCanvasInternalTexture.prototype,
    $_QE.prototype.DomElementInternal.prototype,
    $_QE.prototype.DomCanvas.prototype,
    {
        initialize_dom_canvas: function(number_of_rows, width, font) {
            this.initialize_dom_element('canvas');
            this.initialize_renderer_text(font, number_of_rows, width);
            this._set_texture();
        },

        _set_texture: function() {
            this.texture = new THREE.Texture(this._element);
            // TODO: Based off distance to player.
            //this.texture.magFilter = THREE.NearestFilter;
            //this.texture.minFilter = THREE.NearestFilter;
            this.texture.anisotropy = QE.renderer.capabilities.getMaxAnisotropy();

            if (this.height != this._canvas_height || this.width != this._canvas_width) {
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

            this.context = this._element.getContext('2d');

            if (this.font != null) {
                this.context.font = this.font.font_as_string;
            }
        },

    }
);
