'use strict';

$_QE.prototype.FeatureTitleBar = function() {

    this.add_title = function(text, interactive=false, x_position=0, centered=false) {
        this.title = new $_QE.prototype.Text3D(false, 64, text, interactive);
        this.add_attachment(this.title, true);

        /*
        let parent_half = this.width * 0.5;
        let x_offset = -parent_half + (x_position * this.width);
        let x_width = this.title.width / this.width;
        if (centered) {
            x_offset -= (x_width / 2) * this.width;
        }
        let y_height = this.title.height / this.height;
        */

        this.title.set_offset_vertical_percentage(1, .5);
        this.title.set_offset_horizontal_percentage(0, 0);
    };

    this.add_close_button = function() {
        this.button_close = new $_QE.prototype.FloatingIcon(false, ASSET_ICON_CROSS, 64, QE.COLOR_RED);
        this.button_close.set_to_button(function() {
            l('TODO: CLOSE ME!');
        });
        this.add_attachment(this.button_close, true);
        this.button_close.set_offset_vertical_percentage(1, .5);
        this.button_close.set_offset_horizontal_percentage(1, -.5);
    };

};