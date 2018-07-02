'use strict';

$_QE.prototype.CanvasRendering = function() {

    this.clear = function() {
        this.context.fillStyle = '###';
        this.context.clearRect(0, 0, this._w, this._h);
        this.context.fillStyle = this.current_background_color;
        this.context.fillRect(0, 0, this._w, this._h);
    };

    this.pre_render = function() {
        this.clear();
        this.context.fillStyle = '#' + this.current_foreground_color.getHexString();
        l('Current color');
        l(this.current_foreground_color);
    };

    this.render = function() {
        this.pre_render();

        if (this.text_property_centered) {
            this.context.textAlign = 'center';
            this.context.fillText(this.canvas_text, this.width / 2, Math.floor(this.font_size * .9));
            l('Rendered text! {' + this.canvas_text + '}');
        } else {
            this.context.fillText(this.canvas_text, 0, Math.floor(this.font_size * .9));
            //this.context.fillText(this.canvas_text, 0, 25);
            l('Rendered text not centered! {' + this.canvas_text + '}');
        }
    };

    this.render_rows = function() {
        this.pre_render();

        let r;
        for (r = 0; r < this.rows.length; r++) {
            this.context.fillText(this.rows[r], 0, this._h - (this.font_size * r) - (this.font_y_offset * (r + 1)));
        }
    };

};
