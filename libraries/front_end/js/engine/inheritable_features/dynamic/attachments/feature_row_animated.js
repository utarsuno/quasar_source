'use strict';

$_QE.prototype.FeatureRowAnimated = function() {};

Object.assign(
    $_QE.prototype.FeatureRowAnimated.prototype,
    $_QE.prototype.FeatureRowAbstract.prototype,
    $_QE.prototype.LinkedListNodeRowAnimated.prototype,
    {
        // TODO: Remove
        set_to_animation_step: function(duration, fade, offset_y) {
            $_QE.prototype.FeatureAnimationStep.call(this, duration, fade, offset_y);
        },

        create_row: function(parent_wall, height, y_percentage_position_start, add_raw=false) {
            this.parent_wall = parent_wall;
            this.row_height  = height;
            this.row_y_start = y_percentage_position_start;

            this.initialize_interactive_linked_list($_QE.prototype.LinkedListNodeRowElementAnimated);

            if (add_raw) {
                this.add_raw_element_interactive(this.parent_wall, 1);
                this.parent_wall.add_row(this, true);
            } else {
                this.parent_wall.add_row(this);
            }
        },
    }
);
