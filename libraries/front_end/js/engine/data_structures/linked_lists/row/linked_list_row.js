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

        add_text_row: function(args) {
            args.ARG_WIDTH = this.width;
            let r;
            if (this._node_tail != null) {
                r = this.create_row(null, args.ARG_FONT.height);
            } else {
                r = new $_QE.prototype.FeatureRow();
                r.create_row(this, args.ARG_FONT.height, 1 - (args.ARG_FONT.height / this.height), false);
            }
            let element = r.create_text2d(-1, null, args);
            if (args.ARG_TEXT_ALIGNMENT != null) {
                element.set_text_alignment(args.ARG_TEXT_ALIGNMENT);
            }
        },

        _get_tail_y_offset: function(row_height) {
            if (this._node_tail != null) {
                return this._node_tail.get_row_y() - (row_height / this.height);
            } else {
                return 1.0;
            }
        },

        _create_row: function(interactive, y_offset=null, row_height=null) {
            let r = new $_QE.prototype.FeatureRow();
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

        create_row_animated: function(y_offset, row_height, duration, animation_offset_z) {
            let r = this._create_row(false, y_offset, row_height);
            r.set_to_animation_row(duration, row_height, animation_offset_z);
            this._add_animation_step(r, duration);
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

                r.create_button(b + 2, 1, {
                    ARG_TEXT             : buttons[b].text,
                    ARG_COLOR_FOREGROUND : buttons[b].color,
                    ARG_WIDTH            : button_width,
                    ARG_EVENT_ACTION     : buttons[b].event,
                    ARG_FONT             : font
                });

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
