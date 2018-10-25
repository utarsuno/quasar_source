'use strict';

Object.assign(
    $_QE.prototype,
    {
        _set_binding_fullscreen: function() {
            if (document.webkitCancelFullScreen != null) {
                this.set_flag(ENGINE_BINDING_FULL_SCREEN_DEFAULT, true);
            } else {
                this.set_flag(ENGINE_BINDING_FULL_SCREEN_DEFAULT, false);
            }
            this._is_in_fullscreen();
        },

        enter_fullscreen: function() {
            if (this.get_flag(ENGINE_BINDING_FULL_SCREEN_DEFAULT)) {
                document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else {
                document.body.mozRequestFullScreen();
            }
            this.set_flag_on(ENGINE_STATE_FULL_SCREEN);
        },

        exit_fullscreen: function() {
            if (this.get_flag(ENGINE_BINDING_FULL_SCREEN_DEFAULT)) {
                document.webkitCancelFullScreen();
            } else {
                document.mozCancelFullScreen();
            }
            this.set_flag_off(ENGINE_STATE_FULL_SCREEN);
        },

        _is_in_fullscreen: function() {
            if (this.get_flag(ENGINE_BINDING_FULL_SCREEN_DEFAULT)) {
                this.set_flag(ENGINE_STATE_FULL_SCREEN, document.webkitIsFullScreen);
            } else {
                this.set_flag(ENGINE_STATE_FULL_SCREEN, document.mozFullScreen);
            }
            //return this.get_flag(ENGINE_STATE_FULL_SCREEN);
        },
    }
);
