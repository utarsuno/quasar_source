'use strict';

$_QE.prototype.VisibleRow = function(row_number, container, alignment=TEXT_ALIGNMENT_START) {
    this.row_number     = row_number;
    this.container      = container;
    this.font           = container.font;
    this.y_start        = container.height - (row_number * this.font.height);
    this.text           = '';
    this.text_alignment = alignment;
};

$_QE.prototype.VisibleRow.prototype = {

    set_text_alignment: function(text_alignment) {
        this.text_alignment = text_alignment;
    },

    // Temporary.
    set_text: function(t) {
        this.text                     = t;
        this.update_needed            = true;
        this.container._render_needed = true;
    },

    render: function() {
        this.container.set_text_alignment(this.text_alignment);

        switch (this.text_alignment) {
        case TEXT_ALIGNMENT_START:
            this.container.context.fillText(this.text, 0, this.y_start - this.font.offset);
            break;
        case TEXT_ALIGNMENT_CENTER:
            l('TODO: CENTER!');
            break;
        case TEXT_ALIGNMENT_END:
            this.container.context.fillText(this.text, this.container.width, this.y_start - this.font.offset);
            break;
        }
    },

};




