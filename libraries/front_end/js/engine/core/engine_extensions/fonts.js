'use strict';

$_QE.prototype.Font = function(font_size, height, y_offset) {
    this.font_size = font_size;
    this.height    = height;
    this.y_offset  = y_offset;
};

Object.assign($_QE.prototype, {
    // TODO: Refactor these into Font classes!
    CANVAS_FONT_SMALLER: ['16px', 16, 3],
    CANVAS_FONT_LARGER : ['20px', 20, 4]
});
