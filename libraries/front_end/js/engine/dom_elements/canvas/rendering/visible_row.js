'use strict';

$_QE.prototype.VisibleRow = function(row_number, container) {
    this.row_number = row_number;
    this.container  = container;
    this.font       = container.font;
    this.y_start    = container.height - (row_number * this.font.height);
};

$_QE.prototype.VisibleRow.prototype = {

    text: '',

    // Temporary.
    set_text: function(t) {
        this.text                       = t;
        this.update_needed              = true;
        this.container.rows_need_update = true;
    },

    render: function() {
        this.container.context.fillText(this.text, 0, this.y_start - this.font.offset);
    },

};




