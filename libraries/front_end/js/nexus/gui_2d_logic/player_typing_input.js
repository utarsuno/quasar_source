'use strict';

$_NL.prototype.GUI2DPlayerTypingInput = function() {

    $_QE.prototype.CanvasGUI2D.call(this, '_gui_2d_logs', CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_SINGLE);

    $_QE.prototype.CanvasFont.call(this, $_QE.prototype.CanvasFontPresets['console_font_smaller']);
    $_QE.prototype.FeatureTyping.call(this);

    this.set_background_color(FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    this.get_text_then_clear = function() {
        let t;
        if (this.get_text_length_without_whitespaces() === 0) {
            t = null;
        } else {
            t = this.text;
        }
        this.update_text('');
        this.hide();
        return t;
    };

    this.initialize(800, 20);
    this.initialize_gui(80, 10, 'outline_green');
    this.update_text('');
    this.hide();

    QE.player.player_typing_input_handler = this;

    QE.add_gui_2d_element(this);
};
