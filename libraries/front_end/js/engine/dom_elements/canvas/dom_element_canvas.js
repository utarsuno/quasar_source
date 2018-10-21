'use strict';

$_QE.prototype.DomElementCanvas = function() {};

Object.assign(
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.DomElement.prototype,
    {
        _offset_left   : null,
        _offset_top    : null,
        _margin_top    : null,
        _margin_left   : null,
        _canvas_width  : null,
        _canvas_height : null,

        create_as_canvas: function(canvas_id) {
            return this._create_dom_element(canvas_id, DOM_ELEMENT_INSTANCE_DNE, DOM_ELEMENT_CANVAS);
        },

        set_canvas_reference: function(canvas_id) {
            return this._create_dom_element(canvas_id, DOM_ELEMENT_INSTANCE_EXISTS, DOM_ELEMENT_CANVAS);
        },

        initialize_texture: function() {
            this.context = this._element.getContext('2d');
            if (this.font != null) {
                this.context.font = this.font.font_as_string;
            }
            this.texture = new THREE.Texture(this.canvas);
            // TODO: Based off distance to player.
            //this.texture.magFilter = THREE.NearestFilter;
            //this.texture.minFilter = THREE.NearestFilter;
            this.texture.anisotropy = QE.manager_renderer.renderer.capabilities.getMaxAnisotropy();
        },

        initialize_gui: function(x, y) {
            //this.create_element();

            /*
            if (hide != null) {
                if (hide) {
                    this.hide();
                }
            }
            */

            this.set_canvas_width(this.width);
            this.set_canvas_height(this.height);
            this.initialize_texture();

            if (x != null) {
                this.set_left_offset(x);
            }
            if (y != null) {
                this.set_top_offset(y);
            }

            //if (optional_class_to_add != null) {
            //    this.add_class(optional_class_to_add);
            //}

            /*
            if (append != null) {
                if (append) {
                    this.append_to_document_body();
                }
            } else {
                this.append_to_document_body();
            }*/
        },

        set_canvas_width: function(w) {
            if (this._canvas_width != w) {
                //switch(this._canvas_type) {
                //case CANVAS_GUI_2D_ABSOLUTE_PIXELS:
                this._element.width = w;
                this._canvas_width  = w;
                //    break;
                //}
                //this.canvas.width = this._w;
            }
        },

        set_canvas_height: function(h) {
            if (this._canvas_height != h) {
                //switch(this._canvas_type) {
                //case CANVAS_GUI_2D_ABSOLUTE_PIXELS:
                this._element.height = h;
                this._canvas_height  = h;
                //    break;
                //}
                //this.canvas.height = this._h;
            }
        },

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

        /*__   ___ ___ ___  ___  __   __
         / _` |__   |   |  |__  |__) /__`
         \__> |___  |   |  |___ |  \ .__/ */
        //get_text_width: function(text) {
        //    return this.context.measureText(text).width;
        //},
    }
);

/*
    this.set_margin_top = function(mt) {
        if (this._margin_top !== mt) {
            this._element.style.marginTop = mt + '%';
            this._margin_top = mt;
        }
    };
    this.set_margin_left = function(ml) {
        if (this._margin_left !== ml) {
            this._element.style.marginLeft = ml + '%';
            this._margin_left = ml;
        }
    };
 */

