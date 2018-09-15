'use strict';

$_QE.prototype.GUI2DPlayerTypingInput = function() {

    $_QE.prototype.FeatureColor.call(this, QE.COLOR_GREEN, FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    $_QE.prototype.CanvasGUI2D.call(this, 'gui_2D_typing', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    $_QE.prototype.CanvasRenderingTextLine.call(this, true);

    this.feature_needs_engage_for_parsing_input = false;

    this.initialize_gui(800, 20, 10, 80, GLOBAL_ID_OUTLINE_GREEN, true, true, QE.CANVAS_FONT_SMALLER);
    this.update_text('');
    this.hide();

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

    QE.player.player_typing_input_handler = this;
    QE.add_gui_2d_element(this);

};
