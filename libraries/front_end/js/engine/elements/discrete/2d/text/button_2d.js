'use strict';

//$_QE.prototype.Button2D = function(text, width, height, font, engage_function, color=null) {
$_QE.prototype.Button2D = function(args) {
    this._require_border = true;

    this._initialize_text_2d(args.ARG_TEXT, args.ARG_WIDTH, args.ARG_FONT, args.ARG_COLOR_FOREGROUND, QE.COLOR_RGB_YELLOW);

    this.set_to_button(args.ARG_EVENT_ACTION);

    this.set_text_alignment(TEXT_ALIGNMENT_CENTER);
};

Object.assign(
    $_QE.prototype.Button2D.prototype,
    $_QE.prototype.Text2D.prototype
);
