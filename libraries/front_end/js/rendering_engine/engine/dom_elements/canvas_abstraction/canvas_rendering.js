'use strict';

const CANVAS_RENDERING_ROWS   = true;  // #pre-process_global_constant
const CANVAS_RENDERING_SINGLE = false; // #pre-process_global_constant

$_QE.prototype.CanvasRendering = function(render_style) {

    this.render_style = render_style;

    this.clear = function() {
        this.context.fillStyle = '###';
        this.context.clearRect(0, 0, this._w, this._h);
        this.context.fillStyle = this.current_background_color;
        this.context.fillRect(0, 0, this._w, this._h);
    };

    this.pre_render = function() {
        this.clear();
        this.context.fillStyle = '#' + this.current_foreground_color.getHexString();
        //l('Current color');
        //l(this.current_foreground_color);
    };

    this._render_single_line = function() {
        if (this.text_property_centered) {
            this.context.textAlign = 'center';
            this.context.fillText(this.canvas_text, this.width / 2, Math.floor(this.font_size * .9));
            //l('Rendered text! {' + this.canvas_text + '}');
        } else {
            this.context.fillText(this.canvas_text, 0, Math.floor(this.font_size * .9));
            //this.context.fillText(this.canvas_text, 0, 25);
            //l('Rendered text not centered! {' + this.canvas_text + '}');
        }
    };

    this._render_rows = function() {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            this.context.fillText(this.rows[r].content, 0, this._h - (this.font_size * r) - (this.font_y_offset * (r + 1)));
        }
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

};
