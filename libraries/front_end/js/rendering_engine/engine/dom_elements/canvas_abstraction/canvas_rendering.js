'use strict';

$_QE.prototype.CanvasRendering = function(render_style) {

    this.render_style = render_style;

    this.clear = function() {
        this.context.fillStyle = '#000';
        this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);
        this.context.fillStyle = this.current_background_color;
        //l('Clearing with:');
        //l(this.current_background_color);
        this.context.fillRect(0, 0, this._canvas_width, this._canvas_height);
    };

    this.pre_render = function() {
        this.clear();
        //l('Current color');
        //l(this.current_foreground_color);
        this.context.fillStyle = '#' + this.current_foreground_color.getHexString();
        //l('#' + this.current_foreground_color.getHexString());
    };

    this._render_single_line = function() {
        if (this.text_property_centered) {
            this.context.textAlign = 'center';
            this.context.fillText(this.text, this._canvas_width / 2, Math.floor(this.font_size * .9));
            //l('Rendered text! {' + this.canvas_text + '}');
        } else {
            this.context.fillText(this.text, 0, Math.floor(this.font_size * .9));
            //this.context.fillText(this.canvas_text, 0, 25);
            //l('Rendered text not centered! {' + this.canvas_text + '}');
        }
    };

    this._render_rows = function() {
        let row_offset = 0;
        if (is_defined(this.leave_bottom_row_for_input)) {
            if (this.leave_bottom_row_for_input) {
                row_offset += 1;
            }
        }
        let r;
        for (r = 0; r < this.rows.length; r++) {
            this.context.fillText(this.rows[r].content, 0, this._canvas_height - (this.font_size * (r + row_offset)) - (this.font_y_offset * (r + 1 + row_offset)));
        }
        // Render the user's input.
        this.context.fillText(this.text, 0, this._canvas_height  - (this.font_y_offset));
    };

    this.render = function() {
        this.pre_render();

        switch (this.render_style) {
        case CANVAS_RENDERING_SINGLE:
            this._render_single_line();
            break;
        case CANVAS_RENDERING_ROWS:
            this._render_rows();
            break;
        }

        if (is_defined(this.on_post_render)) {
            this.on_post_render();
        }
    };

    //////

    this._updated = function() {
        this.texture.needsUpdate      = true;
        this.update_needed_for_font   = false;
        this.update_needed_for_text   = false;
        this.update_needed_for_colors = false;
    };

    this.update = function() {
        if (this.update_needed_for_font) {
            this.update_font();
            this.render();
            this._updated();
            return true;
        }
        if (this.update_needed_for_text) {
            this.render();
            this._updated();
            return true;
        }
        if (this.update_needed_for_colors) {
            this.render();
            this._updated();
            return true;
        }
        return false;
    };

};
