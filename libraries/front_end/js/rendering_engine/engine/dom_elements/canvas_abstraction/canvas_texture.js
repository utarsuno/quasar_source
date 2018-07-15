'use strict';

const CANVAS_GUI_2D_ABSOLUTE_PIXELS    = true;  // #pre-process_global_constant
const CANVAS_GUI_2D_RELATIVE_TO_SCREEN = false; // #pre-process_global_constant

$_QE.prototype.CanvasTexture = function(unique_name, type, render_type) {

    this._type = type;
    this._render_type = render_type;

    $_QE.prototype.DomElement.call(this, unique_name, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, DOM_ELEMENT_CANVAS, false);
    $_QE.prototype.FeatureColor.call(this);

    this._w = null;
    this._h = null;
    this._x = null;
    this._y = null;

    this._updated = function() {
        this.texture.needsUpdate      = true;
        this.update_needed_for_font   = false;
        this.update_needed_for_text   = false;
        this.update_needed_for_colors = false;
    };

    this.update = function() {
        if (this.update_needed_for_font) {
            this.update_font();
            this.render();
            this._updated();
            return true;
        }
        if (this.update_needed_for_text) {
            this.render();
            this._updated();
            return true;
        }
        if (this.update_needed_for_colors) {
            this.render();
            this._updated();
            return true;
        }
        return false;
    };


    this.initialize = function(width, height) {
        this.create_element();
        this.canvas = this._element;

        this.set_width(width);
        this.set_height(height);

        this.context = this.canvas.getContext('2d');

        // this.set_font();
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = QE.manager_renderer.renderer.capabilities.getMaxAnisotropy();

        $_QE.prototype.CanvasRendering.call(this, this._render_type);
    };

    this.set_width = function(w) {
        if (this._w !== w) {
            if (this._type === CANVAS_GUI_2D_ABSOLUTE_PIXELS) {
                this._element.style.width = w + 'px';
                this._w = w;
            } else {
                this._element.style.width = w + 'vw';
                this._w = (w / 100) * QE.client.state_window_width_inner;
            }
            this.canvas.width = this._w;
        }
    };

    this.set_height = function(h) {
        if (this._h !== h) {
            if (this._type === CANVAS_GUI_2D_ABSOLUTE_PIXELS) {
                this._element.style.height = h + 'px';
                this._h = h;
            } else {
                this._element.style.height = h + 'vh';
                this._h = (h / 100) * QE.client.state_window_height_inner;
            }
            this.canvas.height = this._h;
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_width = function(text) {
        return this.context.measureText(text).width;
    };
};
