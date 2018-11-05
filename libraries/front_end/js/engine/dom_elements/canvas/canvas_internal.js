'use strict';

$_QE.prototype.DomCanvasInternal = function() {};

Object.assign(
    $_QE.prototype.DomCanvasInternal.prototype,
    $_QE.prototype.DomElementInternal.prototype,
    $_QE.prototype.DomCanvas.prototype,
    {
        initialize_dom_canvas: function() {
            this.initialize_dom_element('canvas');
        },

        _set_context: function() {
            this.context = this._element.getContext('2d');
            //if (this.font != null) {
            //    this.context.font = this.font.font_as_string;
            //}
        },
    }
);
