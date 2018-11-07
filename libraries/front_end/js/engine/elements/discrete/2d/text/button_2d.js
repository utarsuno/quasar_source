'use strict';

$_QE.prototype.Button2D = function(text, width, height, font, engage_function, color=null) {
    this._require_border = true;

    this._initialize_text_2d(text, width, font, color, QE.COLOR_RGB_YELLOW);
    //$_QE.prototype.FeatureButton.call(this, engage_function);
    this.set_to_button(engage_function);

    this.set_text_alignment(TEXT_ALIGNMENT_CENTER);
};

Object.assign(
    $_QE.prototype.Button2D.prototype,
    $_QE.prototype.Text2D.prototype
);
