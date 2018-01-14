'use strict';


function InheritableButton() {

    this.disable = function() {
        this.set_color(COLOR_RED, true);
        this.display_all_child_attachments_with_name(ATTACHMENT_NAME_ERROR);
        // TODO : Refactor this out (have it get set somewhere else)
        this._disabled = true;
    };

    this.enable = function() {
        this.set_color(COLOR_GREEN, true);
        this.hide_all_child_attachments_with_name(ATTACHMENT_NAME_ERROR);
        // TODO : Refactor this out (have it get set somewhere else)
        this._disabled = false;
    };

    this.is_enabled = function() {
        return !this._disabled;
    };
}
