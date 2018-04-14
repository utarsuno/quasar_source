'use strict';

function ConfirmationPrompt(world) {
    this.__init__(world);
}

ConfirmationPrompt.prototype = {

    __init__: function(world) {
        this.wall = new FloatingWall(300, 50, null, null, world, false);
        var row = this.wall.add_row();
        //this.title = row.add_text_2D([0, 1, false], 16, '');
        row = this.wall.add_row();
        this.button_yes = row.add_button([0, HALF, true], 16, 'yes', this.button_yes_clicked.bind(this));
        this.button_yes.set_foreground_color(COLOR_RED);
        this.button_no  = row.add_button([HALF, 1, true], 16, 'no', this.button_no_clicked.bind(this));
        this.button_no.set_foreground_color(COLOR_GREEN);
        this.wall.hide_self_and_all_child_attachments_recursively();

        this._get_confirmation_prompt = null;
        this._action_yes              = null;
        this._action_no               = null;
    },

    set_button: function(b) {
        this.wall.set_attachment_depth_offset(5);
        this.wall.attach_to(b);
        b.set_engage_function(this.prompt.bind(this));
    },

    bind_confirmation_prompt: function(f) {
        this._get_confirmation_prompt = f;
    },

    bind_yes_action: function(f) {
        this._action_yes = f;
    },

    bind_no_action: function(f) {
        this._action_no = f;
    },

    button_yes_clicked: function() {
        this.wall.hide_self_and_all_child_attachments_recursively();
        if (is_defined(this._action_yes)) {
            this._action_yes();
        }
    },

    button_no_clicked: function() {
        this.wall.hide_self_and_all_child_attachments_recursively();
        if (is_defined(this._action_no)) {
            this._action_no();
        }
    },

    prompt: function() {
        this.wall.delete_row_by_index(0);
        var row = this.wall.add_row(0);
        this.title = row.add_text_2D([0, 1, false], 16, this._get_confirmation_prompt());
        l('Setting text to :');
        l(this._get_confirmation_prompt());
        this.title.update_text(this._get_confirmation_prompt());
        this.wall.display_self_and_all_child_attachments_recursively();
    }

};