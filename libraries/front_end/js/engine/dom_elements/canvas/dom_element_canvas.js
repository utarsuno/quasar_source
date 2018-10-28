'use strict';

$_QE.prototype.DomElementCanvas = function() {};

Object.assign(
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.DomElement.prototype,
    {
        _offset_left   : null,
        _offset_right  : null,
        _offset_top    : null,
        _margin_top    : null,
        _margin_left   : null,
        _canvas_width  : null,
        _canvas_height : null,

        _set_canvas_as_reference: function(canvas_id) {
            this._create_dom_element(canvas_id, DOM_ELEMENT_INSTANCE_EXISTS, DOM_ELEMENT_CANVAS);
        },

        _set_canvas_as_internal: function(canvas_id) {
            this._create_dom_element(canvas_id, DOM_ELEMENT_INSTANCE_DNE, DOM_ELEMENT_CANVAS);
        },

        _set_context: function() {
            this.set_canvas_width(this.width);
            this.set_canvas_height(this.height);

            this.context = this._element.getContext('2d');

            if (this.font != null) {
                this.context.font = this.font.font_as_string;
            }
        },

        _initialize_as_hud_from_reference: function() {
            this._set_context();
        },

        _initialize_as_new_canvas: function() {
            this._set_context();

            this.texture = new THREE.Texture(this._element);
            // TODO: Based off distance to player.
            //this.texture.magFilter = THREE.NearestFilter;
            //this.texture.minFilter = THREE.NearestFilter;
            this.texture.anisotropy = QE.renderer.capabilities.getMaxAnisotropy();
        },

        set_canvas_width: function(w) {
            if (this._canvas_width != w) {
                this._element.width = w;
                this._canvas_width  = w;
            }
        },

        set_canvas_height: function(h) {
            if (this._canvas_height != h) {
                this._element.height = h;
                this._canvas_height  = h;
            }
        },

        /*
        set_left_offset: function(o) {
            if (this._offset_left != o) {
                this._element.style.left = o + '%';
                this._offset_left        = o;
            }
        },

        set_top_offset: function(o) {
            if (this._offset_top != o) {
                this._element.style.top = o + '%';
                this._offset_top        = o;
            }
        },
        */

        /*__   ___ ___ ___  ___  __   __
         / _` |__   |   |  |__  |__) /__`
         \__> |___  |   |  |___ |  \ .__/ */
        //get_text_width: function(text) {
        //    return this.context.measureText(text).width;
        //},
    }
);
