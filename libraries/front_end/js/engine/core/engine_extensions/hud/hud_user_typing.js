'use strict';

$_QE.prototype.HUDUserTyping = function() {};

Object.assign(
    $_QE.prototype.HUDUserTyping.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureText.prototype,
    $_QE.prototype.FeatureColor.prototype,
    $_QE.prototype.CanvasRenderingTextLine.prototype,
    {
        __init__: function(application) {
            this.text        = '';
            this.application = application;

            this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT);

            this._initialize_renderer_text_reference_canvas(1200, QE.FONT_ARIAL_12, GLOBAL_ID_HUD_TYPING);
            // The typing hud starts off as hidden (style set ahead of time directly in HTML).
            this.hidden = true;

            $_QE.prototype.FeatureTyping.call(
                this,
                this._on_enter_event.bind(this)
            );
            this.value_post_changed_function = function(text) {
                this.set_row_text(text);
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
