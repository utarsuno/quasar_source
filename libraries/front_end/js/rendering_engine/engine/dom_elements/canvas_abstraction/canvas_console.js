'use strict';

$_QE.prototype.CanvasConsole = function(number_of_rows, font) {

    $_QE.prototype.CanvasFont.call(this, font);

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
        // temp
        this.current_background_color = background_color;
        this.current_foreground_color = foreground_color;
        //

        if (this.update_needed_for_font) {
            this.update_font();
            this.render_text_rows();
            this.texture.needsUpdate = true;
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            l('Paint occured for font!');
            return;
        }
        if (this.update_needed_for_text) {
            this.render_text_rows();
            this.texture.needsUpdate = true;
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            l('Paint occured for text!');
            return;
        }
        if (this.update_needed_for_colors) {
            this.render_text_rows();
            this.texture.needsUpdate = true;
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            l('Paint occured for colors!');
            return;
        }
    };

    /*
        this.update = function(background_color, foreground_color, text) {
        this.render(background_color, foreground_color, text);
        this.texture.needsUpdate = true;
    };
     */
};

