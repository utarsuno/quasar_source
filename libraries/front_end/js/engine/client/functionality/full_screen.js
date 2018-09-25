'use strict';

$_QE.prototype.ClientFunctionalityFullScreen = function() {

    this.toggle_fullscreen = function() {
        if (this.has_fullscreen) {
            this.exit_fullscreen();
        } else {
            this.enter_fullscreen();
        }
        this.has_fullscreen = !this.has_fullscreen;
    };

    this.enter_fullscreen = function() {
        if (this._fullscreen_api_0 != null) {
            document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            document.body.mozRequestFullScreen();
        }
        this.has_fullscreen = true;
    };

    this.exit_fullscreen = function() {
        if (this._fullscreen_api_0 != null) {
            document.webkitCancelFullScreen();
        } else {
            document.mozCancelFullScreen();
        }
        this.has_fullscreen = false;
    };

    this._is_in_fullscreen = function() {
        if (this._fullscreen_api_0 != null) {
            return document.webkitIsFullScreen;
        } else {
            return document.mozFullScreen;
        }
    };

    this._fullscreen_api_0 = document.webkitCancelFullScreen;
    this.has_fullscreen    = this._is_in_fullscreen();
};