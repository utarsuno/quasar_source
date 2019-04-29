'use strict';

$_QE.prototype._Text2DHelper = function(engine) {
    this.engine         = engine;
    this.text_alignment = TEXT_ALIGNMENT_START;
    this.font           = engine.FONT_ARIAL_12;
    this.__init__internal_canvas();

    this.set_canvas_dimensions(2, 2);
    this._context       = this._element.getContext('2d');

    this._set_font(engine.FONT_ARIAL_12);
};

Object.assign(
    $_QE.prototype._Text2DHelper.prototype,
    $_QE.prototype.DomCanvas.prototype,
    $_QE.prototype.CanvasRendererText.prototype,
    $_QE.prototype.FeatureSize.prototype,
    {
        /*__   ___ ___ ___  ___  __   __
         / _` |__   |   |  |__  |__) /__`
         \__> |___  |   |  |___ |  \ .__/ */
        get_text_width: function(text, font) {
            this._set_font(font);
            return this._context.measureText(text).width;
        },
    }
);
