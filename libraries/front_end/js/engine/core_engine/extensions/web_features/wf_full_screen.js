'use strict';

Object.assign(
    $_QE.prototype,
    {
        __init__fullscreen: function() {
            if (document.webkitCancelFullScreen != null) {
                this._fullscreen_enter = function() {
                    document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                };
                this._fullscreen_exit = function() {
                    document.webkitCancelFullScreen();
                };
                this._fullscreen_is_active = function() {
                    return document.webkitIsFullScreen;
                };
            } else {
                this._fullscreen_enter = function() {
                    document.body.mozRequestFullScreen();
                };
                this._fullscreen_exit = function() {
                    document.mozCancelFullScreen();
                };
                this._fullscreen_is_active = function() {
                    return document.mozFullScreen;
                };
            }
            this.flag_set(QEFLAG_STATE_FULLSCREEN, this._fullscreen_is_active());
        },

        enter_fullscreen: function() {
            this._fullscreen_enter();
            this.flag_set_on(QEFLAG_STATE_FULLSCREEN);
        },

        exit_fullscreen: function() {
            this._fullscreen_exit();
            this.flag_set_off(QEFLAG_STATE_FULLSCREEN);
        },

    }
);
