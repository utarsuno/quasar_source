'use strict';

function MessageLogManager() {

    // TODO : Make # of rows dynamically generated based off the screen height!

    // Inherit.
    ClientMessageTyping.call(this);

    this.logs = new DomElement('gui_console_logs');

    this.messages = [];

    // TODO : REFACTOR!
    this.rows = [];
    this.max_row = 50;
    /*
    this.load_log_rows = function() {
        let r = 0;
        while (r < this.max_row) {
            let index = this.max_row - 1 - r;
            this.rows.push(new DomElement('row_' + index.toString()));
            r += 1;
        }
    };
    */

    this.add_server_message_red = function(message) {
        this._add_message(message, 'server', LOG_MESSAGE_COLOR_RED);
    };

    this.add_server_message_green = function(message) {
        this._add_message(message, 'server', LOG_MESSAGE_COLOR_GREEN);
    };

    this.add_chat_message = function(message, user) {
        this._add_message(message, user, LOG_MESSAGE_COLOR_MESSAGE);
    };

    this.add_client_message = function(message) {
        this._add_message(message, ENTITY_OWNER.get_username(), LOG_MESSAGE_COLOR_CLIENT);
    };

    this._add_message = function(message, user, color) {
        // Shift all message indexes up by one.
        let m;
        for (m = 0; m < this.messages.length; m++) {
            this.messages[m].increase_row_index();
        }

        this.messages.unshift(new LogMessage(user + ':' + message, color, 0));

        this._calculate_top_offset();

        // TODO : Delete messages at a certain limit!
    };

    this.update_message_log = function(delta) {
        let m;
        for (m = 0; m < this.messages.length; m++) {
            if (this.messages[m].has_update()) {
                this.messages[m].update(delta);
                let index = this.messages[m].get_row_index();
                this.rows[index].set_color(this.messages[m].get_color());
                this.rows[index].set_text(this.messages[m].get_text());
            }
        }
    };

    this._reset_alphas = function() {
        let m;
        for (m = 0; m < this.messages.length; m++) {
            this.messages[m].reset_delta();
        }
    };

    this._get_number_of_active_rows = function() {
        let num_active = 0;
        let m;
        for (m = 0; m < this.messages.length; m++) {
            if (this.messages[m].is_active()) {
                num_active += 1;
            }
        }
        return num_active;
    };

    this.height_re_sized = function(new_height) {
        this.available_height = new_height * .8;
        let number_of_rows_needed = Math.floor(this.available_height / 12);

        while (this.rows.length < number_of_rows_needed) {
            this._add_row();
        }

        this._calculate_top_offset();
    };

    this._calculate_top_offset = function() {
        // Dynamically adjust the parent dom top % so that the message display at the bottom.
        let current_height_used = this._get_number_of_active_rows() * 12;
        let top_offset = this.available_height - current_height_used;
        this.logs.set_top_height(top_offset);
    };

    this._add_row = function() {
        let new_row = this.logs.prepend_child_element('r' + (this.rows.length).toString());
        new_row.add_class('gui_typing_offset');
        this.rows.push(new_row);
        //this.logs.prepend_break();
    };
}