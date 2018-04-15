'use strict';

function MessageLogManager() {

    // Inherit.
    ClientMessageTyping.call(this);

    this.logs = new DomElement('gui_console_logs');
    this.rows = [];

    this.messages = [];

    this.load_log_rows = function() {
        var r = 0;
        while (r < 70) {
            var index = 69 - r;
            this.rows.push(new DomElement('row_' + index.toString()));
            r += 1;
        }
    };

    this.load_log_rows();

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
        for (var m = 0; m < this.messages.length; m++) {
            this.messages[m].increase_row_index();
        }

        this.messages.unshift(new LogMessage(user + ':' + message, color, 0));

        if (this.messages.length == 70) {
            this.messages.splice(-1,1);
        }
    };

    this.update_message_log = function(delta) {
        for (var m = 0; m < this.messages.length; m++) {
            if (this.messages[m].has_update()) {
                this.messages[m].update(delta);
                var index = this.messages[m].get_row_index();
                this.rows[index].set_color = this.messages[m].get_color();
                this.rows[index].set_text  = this.messages[m].get_text();
            }
        }
    };
}