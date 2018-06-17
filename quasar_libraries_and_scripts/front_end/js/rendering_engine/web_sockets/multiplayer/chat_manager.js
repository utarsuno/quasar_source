'use strict';

function ChatManager() {

    // Create the request object to send chat messages.
    this._server_request_chat_message = new ServerRequestChatMessage();

    this.send_chat_message = function(channel, message) {
        this._server_request_chat_message.set_channel(channel);
        this._server_request_chat_message.set_message(message);
        this._server_request_chat_message.perform_request();
    };

    this.display_received_chat_message = function(user, message, channel) {
        // TODO : Utilize the channel!

        //GUI_TYPING_INTERFACE.add_chat_message(user + ':' + message);
    };

}

/*
        this.server_request_create_account = new ServerRequestCreateAccount();
        this.server_request_create_account.bind_to_button(this.button_create_account);
        this.server_request_create_account.bind_success_event(this.create_account_success.bind(this));
 */