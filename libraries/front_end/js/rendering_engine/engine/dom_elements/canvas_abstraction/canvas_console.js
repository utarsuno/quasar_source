'use strict';

$_QE.prototype.CanvasConsole = function(number_of_rows) {

    this.row_buffer = [];

    this.needs_paint = false;

    let r;
    for (r = 0; r < number_of_rows; r++) {
        this.row_buffer.push(new $_QE.prototype.CanvasTextRow('', r, this));
    }

    $_QE.prototype.CanvasTexture.call(this);

    this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;

    this.add_message = function(content) {
        this.row_buffer[0].content = content;
        let row;
        for (row = this.row_buffer.length - 1; row > 0; row--) {
            this.row_buffer[row].content = this.row_buffer[row - 1].content;
        }
        this.needs_paint = true;
    };

    this.update_step = function(background_color, foreground_color) {
        this.render_rows(background_color, foreground_color, this.row_buffer);
        this.texture.needsUpdate = true;
        l('Paint occured!');
    };

    /*
        this.update = function(background_color, foreground_color, text) {
        this.render(background_color, foreground_color, text);
        this.texture.needsUpdate = true;
    };
     */
};

