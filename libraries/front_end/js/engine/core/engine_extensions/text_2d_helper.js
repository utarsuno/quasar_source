'use strict';

$_QE.prototype._Text2DHelper = function(engine) {
    this.engine         = engine;
    this.text_alignment = TEXT_ALIGNMENT_START;
    this.font           = engine.FONT_ARIAL_12;
    this._set_canvas_as_internal('_internal_only');

    this.set_canvas_width(2);
    this.set_canvas_height(2);
    this.context        = this._element.getContext('2d');

    if (this.font != null) {
        this.context.font = this.font.font_as_string;
    }
};

Object.assign(
    $_QE.prototype._Text2DHelper.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.CanvasRendererText.prototype,
    $_QE.prototype.FeatureSize.prototype,
    {
        /*__   ___ ___ ___  ___  __   __
         / _` |__   |   |  |__  |__) /__`
         \__> |___  |   |  |___ |  \ .__/ */
        get_text_width: function(text, font) {
            this._set_font(font);
            return this.context.measureText(text).width;
        },
    }
);
