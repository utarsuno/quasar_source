'use strict';

$_QE.prototype.FeatureTitleBar = function() {

    this.add_title = function(text, interactive=false, x_position=0, centered=false) {
        this.title = new $_QE.prototype.Text3D(false, 64, text, interactive);
        this.add_attachment(this.title, true);

        let parent_half = this.width * 0.5;
        let x_offset = -parent_half + (x_position * this.width);

        let x_width = this.title.width / this.width;
        //l('the x_width is {' + x_width + '}');

        if (centered) {
            x_offset -= (x_width / 2) * this.width;
        }

        //l('the x_offset is {' + x_offset + '}');

        let y_height = this.title.height / this.height;
        //l(y_height);
        //l(1 + y_height / 2);
        this.title.set_offset_vertical_percentage(1 + y_height / 2, false);

        //this.title.set_offset_vertical_value(this.height / 2);
        //this.title.set_offset_horizontal(this.width / 2);
        this.title.set_offset_horizontal(x_offset);
    };

};