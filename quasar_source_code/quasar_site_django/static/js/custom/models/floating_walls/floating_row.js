'use strict';

function FloatingRow(row_number) {
    this.__init__(row_number);
}

FloatingRow.prototype = {

    __init__: function(row_number) {
        this.row_number = row_number;
    },

    shift_down: function() {
    	this.row_number += 1;
    	// TODO : PERFROM VERTICAL SHIFT ON ALL ELEMENTS!
    }

};