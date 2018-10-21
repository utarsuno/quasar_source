'use strict';

$_QE.prototype.FeatureRow = function() {};

Object.assign(
    $_QE.prototype.FeatureRow.prototype,
    $_QE.prototype.DoublyLinkedListRowElements.prototype,
    {
        create_row: function(parent_wall, height, y_percentage_position_start, add_raw=false) {
            this.parent_wall = parent_wall;
            this.row_height  = height;
            this.row_y_start = y_percentage_position_start;

            if (add_raw) {
                this.add_raw_element_interactive(this.parent_wall, 1);
                this.parent_wall.add_row(this, true);
            } else {
                this.parent_wall.add_row(this);
            }
        },

        create_icon: function(icon_type, color, relative_index) {
            return this.add_relative_element(new $_QE.prototype.FloatingIcon(false, icon_type, this.row_height, color), relative_index, true);
        },

        create_text3d: function(text, color, interactive, relative_index) {
            return this.add_relative_element(new $_QE.prototype.Text3D(false, this.row_height, text, interactive), relative_index, true, true);
        },

        get_next_tab_target_from_current: function(element) {
            return this.get_next_tab_target_from_element(element);
        },
    }
);
