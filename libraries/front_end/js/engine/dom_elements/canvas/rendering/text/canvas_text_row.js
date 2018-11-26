'use strict';

$_QE.prototype.VisibleRow = function(row_number, container, alignment=TEXT_ALIGNMENT_START) {
    this.row_number     = row_number;
    this.container      = container;
    this.font           = container.font;
    this.y_start        = container.height - (row_number * this.font.height);
    this.text           = '';
    this.text_alignment = alignment;
    this._custom_color  = container.current_foreground_color;
};

$_QE.prototype.VisibleRow.prototype = {

    set_text_alignment: function(text_alignment) {
        this.text_alignment = text_alignment;
    },

    // Temporary.
    set_text: function(t, c) {
        this.text                     = t;
        this.update_needed            = true;
        this.container._render_needed = true;
        if (c != null) {
            this._custom_color = c;
        } else {
            this.container._custom_color = this.container.current_foreground_color;
        }
    },

    _clone: function(visible_row) {
        this.set_text(visible_row.text, visible_row._custom_color);
    },

    render: function() {

        this.container._set_text_alignment(this.text_alignment);
        this.container._set_render_color(this._custom_color);

        switch (this.text_alignment) {
        case TEXT_ALIGNMENT_START:
            //this.container.context.fillText(this.text, 0, this.y_start - this.font.offset);
            this.container.context.fillText(this.text, 0, this.y_start - this.font.offset);
            break;
        case TEXT_ALIGNMENT_CENTER:
            // TEMPORARY LOCATION!!!!
            if (this.container.flag_is_on(EFLAG_IS_BORDER_RENDERED)) {
                //this.container.context.strokeStyle = this.container.current_foreground_color;
                //this.container.context.strokeRect(2, 2, this.container.width - 4, this.container.height - 4);
                this.container.context.strokeStlye = this._custom_color;
                this.container.context.strokeRect(4, 4, this.container.width - 8, this.container.height - 8);
            }

            this.container.context.fillText(this.text, this.container.width / 2, this.y_start - this.font.offset);
            break;
        case TEXT_ALIGNMENT_END:
            this.container.context.fillText(this.text, this.container.width, this.y_start - this.font.offset);
            break;
        }
    },

};




