'use strict';

$_QE.prototype.CanvasGUI2DTyping = function(unique_name) {

    $_QE.prototype.CanvasGUI2DText.call(this, unique_name);

    this.set_background_color(FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    this.add_text_and_leave_typing_state = function() {
        QE.player.set_state(PLAYER_STATE_FULL_CONTROL);
        QE.gui_2d_logs.add_row('you: ' + this.canvas_text);
        this.clear();
        this.hide();
    };

};
