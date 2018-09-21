'use strict';

$_QE.prototype.GUI2DPlayerTypingInput = function(application) {

    this.application = application;

    this.enter_typing_state = function() {
        this.render();
        this.show();
    };

    this._on_enter_event = function() {
        if (this.get_text_length_without_whitespaces() != 0) {
            this.application.parse_user_input_from_hud(this.get_text_and_clear());
        }
        this.hide();
        QE.player.set_state(PLAYER_STATE_FULL_CONTROL);
    };

    $_QE.prototype.FeatureColor.call(this, QE.COLOR_GREEN, FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    $_QE.prototype.CanvasGUI2D.call(this, 'gui_2D_typing', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);


    $_QE.prototype.CanvasRenderingTextLine.call(this, true, this._on_enter_event.bind(this));

    this.feature_needs_engage_for_parsing_input = false;

    this.initialize_gui(800, 20, 10, 80, GLOBAL_ID_OUTLINE_GREEN, true, true, QE.CANVAS_FONT_SMALLER);
    this.update_text('');
    this.hide();
};
