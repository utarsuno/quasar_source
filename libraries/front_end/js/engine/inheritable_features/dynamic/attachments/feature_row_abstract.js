'use strict';

$_QE.prototype.FeatureRowAbstract = function() {};

Object.assign(
    $_QE.prototype.FeatureRowAbstract.prototype,
    $_QE.prototype.LinkedListRowElements.prototype,
    {
        create_icon: function(icon_type, color, relative_index, depth_offset=null) {
            let element = new $_QE.prototype.FloatingIcon(icon_type, this.row_height, color);
            return this._add_element(element, relative_index, depth_offset);
        },

        create_icon_button: function(icon_type, color, relative_index, engage_function, use_confirmation_prompt=false, depth_offset=null) {
            let element = new $_QE.prototype.FloatingIconButton(icon_type, this.row_height, color, engage_function);
            this.add_relative_element(element, relative_index, true);
            this._set_element_depth_offset(element, depth_offset);
            if (use_confirmation_prompt) {
                element.use_confirmation_prompt();
            }
            return element;
        },

        create_text3d: function(text, color, interactive, relative_index, depth_offset=null) {
            let element = new $_QE.prototype.Text3D(this.row_height, text, interactive);
            return this._add_element(element, relative_index, depth_offset);
        },

        create_text2d: function(text, color, font, width, relative_index, depth_offset=null) {
            let element = new $_QE.prototype.Text2D(text, width, this.row_height, font, false, color);
            return this._add_element(element, relative_index, depth_offset);
        },

        create_button: function(text, color, width, relative_index, engage_function, depth_offset=null, font=null) {
            let element = new $_QE.prototype.Button2D(text, width, this.row_height, font, engage_function, color);
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
    }
);
