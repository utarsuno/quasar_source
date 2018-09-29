'use strict';

$_QE.prototype.FeatureRow = function(height, y_percentage_position_start) {

    this.row_height     = height;
    this.row_y_start    = y_percentage_position_start;

    this.element_center = null;
    this.elements_right = new $_QE.prototype.RelativeLinkedList();
    this.elements_left  = new $_QE.prototype.RelativeLinkedList();

    this._create_icon = function(icon_type, color, relative_index, left) {
        let icon = new $_QE.prototype.FloatingIcon(false, icon_type, this.row_height, color);
        if (left) {
            this.add_element_left(icon, true, relative_index);
        } else {
            this.add_element_right(icon, true, relative_index);
        }
        return icon;
    };

    this.create_icon_left = function(icon_type, color, relative_index=0) {
        return this._create_icon(icon_type, color, relative_index, true);
    };

    this.create_icon_right = function(icon_type, color, relative_index=0) {
        return this._create_icon(icon_type, color, relative_index, false);
    };

    this.create_text3d_center = function(text, color, interactive) {
        let text3d = new $_QE.prototype.Text3D(false, this.row_height, text, interactive);
        this.add_element_center(text3d, true);
        return text;
    };

    this.add_element_center = function(element, create) {
        this.element_center = element;
        this._add_element(element, create);
        // Set x position.
        element.set_offset_horizontal_percentage(0.5, -.5);
    };

    this.add_element_left = function(element, create, relative_index) {
        this._add_element(element, create);
        element.set_to_row_element(relative_index, true);
        this.elements_left.insert(element);
    };

    this.add_element_right = function(element, create, relative_index) {
        this._add_element(element, create);
        element.set_to_row_element(relative_index, false);
        this.elements_right.insert(element);
    };

    this._add_element = function(element, create) {
        this.add_attachment(element, create);
        // Set y position.
        element.set_offset_vertical_percentage(this.row_y_start, 0.5);
    };

};
