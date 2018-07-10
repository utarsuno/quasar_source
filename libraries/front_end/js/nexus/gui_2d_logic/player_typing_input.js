'use strict';

$_NL.prototype.GUI2DPlayerTypingInput = function() {

    this.gui_2d_typing = new $_QE.prototype.CanvasGUI2DText('_gui_2d_logs', CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    this.gui_2d_typing.initialize(800, 20);
    this.gui_2d_typing.initialize_gui(80, 10, 'outline_green');
    this.gui_2d_typing.set_text('');
    this.gui_2d_typing.hide();

    QE.add_gui_2d_element(this.gui_2d_typing);

    this.enter_typing_state = function() {
        this.gui_2d_typing.render();
        this.gui_2d_typing.show();
    };

    this.leave_typing_state = function() {
        QE.player.set_state(PLAYER_STATE_FULL_CONTROL);

        let text = this.gui_2d_typing.get_text_then_clear();

        if (text !== null) {
            if (text.startsWith('>')) {
                this.websocket_message_parser.send_request_cmd(text.substring(1));
            } else {
                this.websocket_message_parser.send_request_chat(text);
            }
        }
    };

    this.parse_key_event_for_typing_state = function(event) {
        this.gui_2d_typing.parse_key_event(event);
    };
};
