'use strict';

$_QE.prototype.CloseButton = function() {

    // TODO once needed : on_close_event

    let one_pixel_width = 1 / this.width;
    let x_start = 1 - (one_pixel_width * 16);
    let x_stop = 1;
    let total_percentage_of_parent_width = (x_stop - x_start);
    this._close_button = new $_QE.prototype.FloatingIconButton(this.world, ICON_CROSS, 16, this.force_hide_self_and_all_child_attachments_recursively.bind(this));
    this._close_button.set_attachment_vertical_offset(-8, HALF);
    this._close_button.set_attachment_horizontal_offset(0, -HALF + x_start + total_percentage_of_parent_width / 2);
    this._close_button.set_attachment_depth_offset(2);
    this._close_button.attach_to(this);

};