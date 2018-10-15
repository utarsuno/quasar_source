'use strict';

$_QE.prototype.FeatureRow = function(parent_wall, height, y_percentage_position_start) {

    this.parent_wall = parent_wall;
    this.row_height  = height;
    this.row_y_start = y_percentage_position_start;

    this.parent_wall.add_row(this);

    this.elements = new $_QE.prototype.DoublyLinkedListRowElements(this);

    this.create_icon = function(icon_type, color, relative_index) {
        return this.elements.add_relative_element(new $_QE.prototype.FloatingIcon(false, icon_type, this.row_height, color), relative_index, true);
    };

    this.create_text3d = function(text, color, interactive, relative_index) {
        return this.elements.add_relative_element(new $_QE.prototype.Text3D(false, this.row_height, text, interactive), relative_index, true, true);
    };

    this.get_next_tab_target_from_current = function(element) {
        return this.elements.get_next_tab_target_from_current(element);
    };

    this.add_tab_target = function(element) {
        l('ADD TAB TARGET?');
        l(element);

        //this.elements_tab_target.insert(element);
    };

    this.get_tab_target_first = function() {
        //if (this.elements_tab_target._length > 0) {
        //    return this.elements_tab_target._node_head;
        //}
        return null;
    };

    this.get_tab_target_last = function() {

    };

};
