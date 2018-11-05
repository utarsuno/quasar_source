'use strict';

$_QE.prototype.DomCanvasExternal = function() {};

Object.assign(
    $_QE.prototype.DomCanvasExternal.prototype,
    $_QE.prototype.DomElementExternal.prototype,
    $_QE.prototype.DomCanvas.prototype,
    {
        initialize_dom_canvas: function(id, display_style=null) {
            this.initialize_dom_element(id, display_style);
        },

        _set_context: function() {
            this.context = this._element.getContext('2d');

            // TODO: Remove this.
            if (this.font != null) {
                this.context.font = this.font.font_as_string;
            }
        },


    }
);
