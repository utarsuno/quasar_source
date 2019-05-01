'use strict';

$_QE.prototype.HUDUserTyping = function() {};

Object.assign(
    $_QE.prototype.HUDUserTyping.prototype,
    $_QE.prototype.HUDElement.prototype,
    $_QE.prototype.FeatureText.prototype,
    $_QE.prototype.CanvasRenderingTextLine.prototype,
    {
        __init__: function(application) {
            this.text        = '';
            this.application = application;

            this.__init__hud_element({
                ARG_NUMBER_OF_ROWS  : -1,
                ARG_WIDTH           : 1200,
                ARG_DOM_ELEMENT_ID  : GLOBAL_ID_HUD_TYPING,
                ARG_COLOR_FOREGROUND: QE.COLOR_RGB_GREEN_LIGHT
            });

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
            if (this.get_text_length_without_whitespaces() !== 0) {
                QE.manager_web_sockets.parse_user_input_from_hud(this.get_text_and_clear());
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
