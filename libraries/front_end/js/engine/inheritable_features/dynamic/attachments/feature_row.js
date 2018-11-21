'use strict';

$_QE.prototype.FeatureRow = function() {};

Object.assign(
    $_QE.prototype.FeatureRow.prototype,
    $_QE.prototype.LinkedListRowElements.prototype,
    //
    {
        create_row: function(parent_wall, height, y_percentage_position_start, add_raw=false) {
            this.parent_wall = parent_wall;
            this.row_height  = height;
            this.row_y_start = y_percentage_position_start;

            this.initialize_interactive_linked_list($_QE.prototype.LLNodeRowElement);

            if (add_raw) {
                this.add_raw_element_interactive(this.parent_wall, 1);
                this.parent_wall.add_row(this, true);
            } else {
                this.parent_wall.add_row(this);
            }
        },

        //

        create_icon: function(relative_index, depth_offset, args) {
            args.ARG_SIZE = this.row_height;
            let element = new $_QE.prototype.FloatingIcon(args);
            return this._add_element(element, relative_index, depth_offset);
        },

        create_icon_button: function(relative_index, depth_offset, args) {
            args.ARG_SIZE = this.row_height;
            let element = new $_QE.prototype.FloatingIconButton(args);
            this.add_relative_element(element, relative_index, true);
            this._set_element_depth_offset(element, depth_offset);
            if (args.ARG_USE_CONFIRMATION_PROMPT != null && args.ARG_USE_CONFIRMATION_PROMPT) {
                element.use_confirmation_prompt();
            }
            return element;
        },

        create_text3d: function(relative_index, depth_offset, args) {
            args.ARG_SIZE = this.row_height;
            let element = new $_QE.prototype.Text3D(args);
            return this._add_element(element, relative_index, depth_offset);
        },

        create_text2d: function(relative_index, depth_offset, args) {
            let element = new $_QE.prototype.Text2D(args);
            return this._add_element(element, relative_index, depth_offset);
        },

        create_button: function(relative_index, depth_offset, args) {
            args.ARG_HEIGHT = this.row_height;
            let element = new $_QE.prototype.Button2D(args);
            return this._add_element(element, relative_index, depth_offset);
        },

        _add_element: function(element, relative_index, depth_offset) {
            this.add_relative_element(element, relative_index, true);
            this._set_element_depth_offset(element, depth_offset);
            return element;
        },

        _set_element_depth_offset: function(element, offset) {
            if (offset != null) {
                element.set_offset_depth(offset);
            } else {
                element.set_offset_depth(1);
            }
        },

        //

        set_to_animation_row: function(duration, offset_y, offset_z) {
            $_QE.prototype.FeatureAnimationStep.call(this, duration);
            this._animation_y_offset = offset_y;
            this._animation_z_offset = offset_z;
            this._animation_y_end    = 0;
            this._animation_y_start  = 0;
            this._animation_z_end    = 0;
            this._animation_z_start  = 0;

            this.animation_step_pre_start = function() {
                if (this._animation_y_offset != null) {
                    let n = this._node_head;
                    while (n != null) {
                        n._animation_y_end   = n._get_relative_y();
                        n._animation_y_start = n._get_relative_y() + this._animation_y_offset;

                        n._animation_z_end   = n._get_relative_z();
                        n._animation_z_start = n._get_relative_z() + this._animation_z_offset;

                        n = n._node_next;
                    }
                }
            };

            this._animation_step_set_elapsed_time = function(time) {
                let n = this._node_head;
                while (n != null) {
                    n._set_opacity(time);
                    //n._set_relative_y(time);
                    //n._set_relative_z(time);
                    n._set_relative_y_z(time);
                    n = n._node_next;
                }
            };

            this._animation_step_set_opacity = function(opacity) {
                let n = this._node_head;
                while (n != null) {
                    n._set_opacity(opacity);
                    n = n._node_next;
                }
            };
        },
    }
);
