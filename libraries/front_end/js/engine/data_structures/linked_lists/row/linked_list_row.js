'use strict';

$_QE.prototype.LinkedListRows = function() {};

Object.assign(
    $_QE.prototype.LinkedListRows.prototype,
    $_QE.prototype.LinkedListInteractive.prototype,
    {

        add_row: function(row, interactive=false) {
            this.insert_element_at_position(row, this._length + 1);
            if (interactive) {
                this.on_element_set_to_interactive(row);
            }
        },

        ensure_row_is_interactive: function(row) {
            let node = this.get_node_from_object(row);
            if (!node.already_in_interactive_list) {
                node.already_in_interactive_list = true;
                this.on_node_set_to_interactive(node);
            }
        },

        get_next_tab_target_from_row_after: function(row) {
            let node = this.get_node_from_object(row);
            if (node._interactive_next != null) {
                return node._interactive_next.get_first_interactive_element();
            } else {
                if (this._interactive_head != node) {
                    return this._interactive_head.get_first_interactive_element();
                }
                l('returning null??!!!');
                return null;
            }
        },

        add_text_row: function(text, color, font, text_alignment=null) {
            if (this._node_tail != null) {
                //let r       = this._get_new_row_as_tail(font.height);
                let r = this.create_row(null, font.height);
                let element = r.create_text2d(text, color, font, this.width, -1);
                if (text_alignment != null) {
                    element.set_text_alignment(text_alignment);
                }
            } else {
                let r = new $_QE.prototype.FeatureRow();
                r.create_row(this, font.height, 1 - (font.height / this.height), false);
                let element = r.create_text2d(text, color, font, this.width, -1);
                if (text_alignment != null) {
                    element.set_text_alignment(text_alignment);
                }
            }
        },

        _get_tail_y_offset: function(row_height) {
            if (this._node_tail != null) {
                return this._node_tail.get_row_y() - (row_height / this.height);
            } else {
                return 1.0;
            }
        },

        _get_new_row_object: function() {
            if (this._node_class == $_QE.prototype.LinkedListNodeRow) {
                return new $_QE.prototype.FeatureRow();
            } else {
                return new $_QE.prototype.FeatureRowAnimated();
            }
        },

        _create_row: function(interactive, y_offset=null, row_height=null) {
            let r = this._get_new_row_object();
            if (row_height != null && y_offset != null) {
                r.create_row(this, row_height , y_offset                            , interactive);
            } else if (row_height != null) {
                r.create_row(this, row_height , this._get_tail_y_offset(row_height) , interactive);
            } else if (y_offset != null) {
                r.create_row(this, this.height, y_offset                            , interactive);
            } else {
                r.create_row(this, this.height, this._get_tail_y_offset(this.height), interactive);
            }
            return r;
        },

        create_row_interactive: function(y_offset=null, row_height=null) {
            return this._create_row(true, y_offset, row_height);
        },

        create_row: function(y_offset=null, row_height=null) {
            return this._create_row(false, y_offset, row_height);
        },

        add_buttons_row: function(font, buttons) {
            let r = this.create_row(null, font.height);

            let number_of_buttons = buttons.length;
            let button_width      = this.width / number_of_buttons;

            let b = number_of_buttons - 1;
            while (b >= 0) {

                //l(buttons[b]);

                r.create_button(
                    buttons[b].text,
                    buttons[b].color,
                    button_width,
                    b + 2,
                    buttons[b].event,
                    1,
                    font
                );

                b--;
            }
        },

    }
);


/*
        get_first_tab_target: function() {
            if (this._length_interactive == 0) {
                return null;
            }
            return this._interactive_head.get_first_interactive_element();
        },
 */
