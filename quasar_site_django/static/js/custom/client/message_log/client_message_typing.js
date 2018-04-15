'use strict';

function ClientMessageTyping() {

    this.gui_typing = new DomElement('gui_typing_input_field');

    this.input_text = new InputTextProcessor('');

    this.hide_client_typing = function() {
        this.gui_typing.hide();
        this.input_text.clear_text();
        this.gui_typing_input.set_text(this.input_text.get_text());
    };

    this.show_client_typing = function() {
        this.gui_typing.show();
    };

    this.key_down_event = function(event) {
        this.input_text.parse_key_event(event);
        this.gui_typing_input.set_text(this.input_text.get_text());
    };

    this.add_user_text = function() {
        var current_text = this.input_text.get_text();
        if (current_text.length > 0) {
            MANAGER_WEB_SOCKETS.send_chat_message('global', current_text);
        }
        this.hide_client_typing();
    };
}