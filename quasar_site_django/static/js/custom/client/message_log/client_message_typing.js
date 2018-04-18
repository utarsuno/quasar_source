'use strict';

function ClientMessageTyping() {

    this.gui_typing = new DomElement('gui_typing_input_field');
    this.parent_dom = new DomElement('gui_typing');

    this.input_text = new InputTextProcessor('');

    this.hide_client_typing = function() {
        this.parent_dom.hide();
        this.gui_typing.hide();
        this.input_text.clear_text();
        this.gui_typing.set_text(this.input_text.get_text());
    };

    this.show_client_typing = function() {
        this.parent_dom.show();
        this.gui_typing.show();
        this._reset_alphas();
    };

    this.key_down_event = function(event) {
        this.input_text.parse_key_event(event);
        this.gui_typing.set_text(this.input_text.get_text());
    };

    this.add_user_text = function() {
        let current_text = this.input_text.get_text();
        if (current_text.length > 0) {
            MANAGER_WEB_SOCKETS.send_chat_message('global', current_text);
        }
        this.hide_client_typing();
    };
}