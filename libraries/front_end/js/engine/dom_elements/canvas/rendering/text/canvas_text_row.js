'use strict';

$_QE.prototype.VisibleRow = function(row_number, container, alignment=TEXT_ALIGNMENT_START) {
    this.row_number     = row_number;
    this.row_height     = container.font.height;
    this.container      = container;
    this.font           = container.font;
    this.y_bottom       = container.height - (row_number * this.row_height);
    this.y_top          = this.y_bottom - this.row_height;
    this.text           = '';
    this.set_text_alignment(alignment);
    this._custom_color  = container.current_foreground_color;
};

$_QE.prototype.VisibleRow.prototype = {

    _set_row_to_need_update: function() {
        this.update_needed            = true;
        this.container._render_needed = true;
    },

    set_text_alignment: function(text_alignment) {
        this.text_alignment = text_alignment;
    },

    // Temporary.
    set_text: function(t, c) {
        if (this.text != t) {
            this.text = t;
            this._set_row_to_need_update();
            if (c != null) {
                this._custom_color = c;
            } else {
                this.container._custom_color = this.container.current_foreground_color;
            }
        }
    },

    _clone: function(visible_row) {
        this.set_text(visible_row.text, visible_row._custom_color);
        this._set_row_to_need_update();
    },

    fill_background: function() {
        this.container._context.fillRect(0, this.y_top, this.container.width, this.row_height);
    },

    clear_row: function() {
        this.container._context.clearRect(0, this.y_top, this.container.width, this.row_height);
    },

    render: function() {

        this.container._set_text_alignment(this.text_alignment);
        this.container._set_render_color(this._custom_color);

        switch (this.text_alignment) {
        case TEXT_ALIGNMENT_START:
            //this.container.context.fillText(this.text, 0, this.y_start - this.font.offset);
            this.container._context.fillText(this.text, 0, this.y_bottom - this.font.offset);
            break;
        case TEXT_ALIGNMENT_CENTER:
            // TEMPORARY LOCATION!!!!
            if (this.container.flag_is_on(EFLAG_IS_BORDER_RENDERED)) {
                //this.container.context.strokeStyle = this.container.current_foreground_color;
                //this.container.context.strokeRect(2, 2, this.container.width - 4, this.container.height - 4);
                this.container._context.strokeStlye = this._custom_color;
                this.container._context.strokeRect(4, 4, this.container.width - 8, this.container.height - 8);
            }

            this.container._context.fillText(this.text, this.container.width / 2, this.y_bottom - this.font.offset);
            break;
        case TEXT_ALIGNMENT_END:
            this.container._context.fillText(this.text, this.container.width, this.y_bottom - this.font.offset);
            break;
        }
    },

};




