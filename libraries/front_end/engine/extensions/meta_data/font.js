'use strict';

$_QE.prototype.Font = function(font_size, height, offset) {
    this.__init__font(font_size, height, offset);
};

$_QE.prototype.Font.prototype = {
    font_as_string: null,
    height        : null,
    offset        : null,

    __init__font: function(font_as_string, height, offset) {
        this.font_as_string = font_as_string;
        this.height         = height;
        this.offset         = offset;
        return this;
    },
};
