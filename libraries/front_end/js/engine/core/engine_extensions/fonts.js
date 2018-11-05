'use strict';

$_QE.prototype.Font = function(font_size, height, offset) {
    this.__init__(font_size, height, offset);
};

$_QE.prototype.Font.prototype = {
    font_as_string: null,
    height        : null,
    offset        : null,
    __init__: function(font_as_string, height, offset) {
        this.font_as_string = font_as_string;
        this.height         = height;
        this.offset         = offset;
        return this;
    },
};

/*
Object.assign($_QE.prototype, {
    FONT_ARIAL_8 : new $_QE.prototype.Font('8px Arial' , 8 , 1),
    FONT_ARIAL_12: new $_QE.prototype.Font('12px Arial', 12, 2),
    FONT_ARIAL_16: new $_QE.prototype.Font('16px Arial', 16, 3),
    FONT_ARIAL_20: new $_QE.prototype.Font('20px Arial', 20, 4),
    FONT_ARIAL_24: new $_QE.prototype.Font('24px Arial', 24, 5),
    FONT_ARIAL_28: new $_QE.prototype.Font('28px Arial', 28, 6),
    FONT_ARIAL_32: new $_QE.prototype.Font('32px Arial', 32, 7),
});
*/

Object.assign($_QE.prototype, {
    /*
    FONT_ARIAL_8 : new $_QE.prototype.Font('8px Arial' , 8 ,2),
    FONT_ARIAL_12: new $_QE.prototype.Font('12px Arial', 12, 4),
    FONT_ARIAL_16: new $_QE.prototype.Font('16px Arial', 16, 6),
    FONT_ARIAL_20: new $_QE.prototype.Font('20px Arial', 20, 8),
    FONT_ARIAL_24: new $_QE.prototype.Font('24px Arial', 24, 10),
    FONT_ARIAL_28: new $_QE.prototype.Font('28px Arial', 28, 12),
    FONT_ARIAL_32: new $_QE.prototype.Font('32px Arial', 32, 14),
    */

    /*
    FONT_ARIAL_8  : new $_QE.prototype.Font('8px Arial'  , 8, 0),
    FONT_ARIAL_16 : new $_QE.prototype.Font('16px Arial' , 16, 2),
    FONT_ARIAL_32 : new $_QE.prototype.Font('32px Arial' , 32, 6),
    FONT_ARIAL_64 : new $_QE.prototype.Font('64px Arial' , 64, 14),
    */


    FONT_ARIAL_8 : new $_QE.prototype.Font('16px Arial' , 16, 2),
    FONT_ARIAL_12: new $_QE.prototype.Font('24px Arial' , 24, 6), // 4
    //FONT_ARIAL_12: new $_QE.prototype.Font('24px Arial' , 24, 10),
    FONT_ARIAL_16: new $_QE.prototype.Font('32px Arial' , 32, 6),
    FONT_ARIAL_20: new $_QE.prototype.Font('40px Arial' , 40, 9), // tried 12
    FONT_ARIAL_24: new $_QE.prototype.Font('48px Arial' , 48, 10),
    FONT_ARIAL_28: new $_QE.prototype.Font('56px Arial' , 56, 12),
    FONT_ARIAL_32: new $_QE.prototype.Font('64px Arial' , 64, 14),


    FONT_ARIAL_8_BOLD : new $_QE.prototype.Font('bold 16px Arial' , 16, 2),
    FONT_ARIAL_12_BOLD: new $_QE.prototype.Font('bold 24px Arial' , 24, 6), // 4
    //FONT_ARIAL_12: new $_QE.prototype.Font('24px Arial' , 24, 10),
    FONT_ARIAL_16_BOLD: new $_QE.prototype.Font('bold 32px Arial' , 32, 6),
    FONT_ARIAL_20_BOLD: new $_QE.prototype.Font('bold 40px Arial' , 40, 9), // tried 12
    FONT_ARIAL_24_BOLD: new $_QE.prototype.Font('bold 48px Arial' , 48, 10),
    FONT_ARIAL_28_BOLD: new $_QE.prototype.Font('bold 56px Arial' , 56, 12),
    FONT_ARIAL_32_BOLD: new $_QE.prototype.Font('bold 64px Arial' , 64, 14),
});

