'use strict';


$_QE.prototype.Button2D = function(args) {
    args[ARG_ALIGNMENT_TEXT] = TEXT_ALIGNMENT_CENTER;
    this.__init__text2d(args);
    $_QE.prototype.FeatureButton.call(this, args);
};

Object.assign(
    $_QE.prototype.Button2D.prototype,
    $_QE.prototype.Text2D.prototype
);
