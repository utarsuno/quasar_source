'use strict';

$_QE.prototype.CanvasLines = function(number_of_rows, font) {
    $_QE.prototype.CanvasFont.call(this, font);

    this.rows = [];
    this.update_needed_for_text = false;

    this.number_of_rows = number_of_rows;

    //let r;
    //for (r = 0; r < number_of_rows; r++) {
    //    this.rows.push(new $_QE.prototype.CanvasTextRow('', r, this));
    //}

    this.add_row = function(content) {
        this.rows.unshift(new $_QE.prototype.CanvasTextRow(content, null, this));
        //this.rows.push(new $_QE.prototype.CanvasTextRow(content, null, this));
        this.update_needed_for_text = true;
    };
};



/*

$_QE.prototype.CanvasConsole = function(number_of_rows, font) {

    $_QE.prototype.CanvasLines.call(this, number_of_rows, font);
    $_QE.prototype.CanvasTexture.call(this, null, CANVAS_GUI_2D_ABSOLUTE_PIXELS);

    this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;

    this.add_message = function(content) {
        this.row_buffer[0].content = content;
        let row;
        for (row = this.row_buffer.length - 1; row > 0; row--) {
            this.row_buffer[row].content = this.row_buffer[row - 1].content;
        }
        this.update_needed_for_text = true;
    };
};



 */