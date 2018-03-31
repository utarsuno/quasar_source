'use strict';

function Client() {
    this.__init__();
}

Client.prototype = {

    __init__: function() {
        this.is_mobile = false;
        this._detect_if_mobile();
    },

    _detect_if_mobile: function() {
        // from : https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.is_mobile = true;
        }
    }

};