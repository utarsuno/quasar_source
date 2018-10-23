'use strict';

$_QE.prototype.HUDUserTyping = function() {};

Object.assign(
    $_QE.prototype.HUDUserTyping.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureText.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    {
        __init__: function(application) {
            this.application = application;
            this.set_properties(1, 600, QE.FONT_ARIAL_12, GLOBAL_ID_HUD_TYPING);
            this.initialize_gui(10, 80);
            this.hide();

            $_QE.prototype.FeatureTyping.call(
                this,
                this._on_enter_event.bind(this)
            );
            this.value_post_changed_function = function(text) {
                this.rows[0].set_text(text);
            }.bind(this);

            return this;
        },

        _on_enter_event: function() {
            if (this.get_text_length_without_whitespaces() != 0) {
                this.application.parse_user_input_from_hud(this.get_text_and_clear());
            }
            this.hide();
            QE.player.set_state(PLAYER_STATE_FULL_CONTROL);
        },

        enter_typing_state: function() {
            this.update();
            this.show();
        },
    }
);
