'use strict';

const DEBUG_MODE_NONE = 1; // #pre-process_global_constant
const DEBUG_MODE_FPS  = 2; // #pre-process_global_constant
const DEBUG_MODE_FULL = 3; // #pre-process_global_constant

function Client() {
    this.__init__();
}

Client.prototype = {

    __init__: function() {
        this.is_mobile    = false;
        this.is_vr        = false;
        this.debug_mode   = DEBUG_MODE_FPS;
        this.stats_api    = new StatsAPI();
        this.data_display = new DataDisplay();
        this._detect_if_mobile();

        // Inherit.
        CookieManager.call(this);
        SessionManager.call(this);
        MessageLogManager.call(this);

        // TODO : Save the username here.
    },

    set_debug_mode: function(debug_mode) {
        this.debug_mode = debug_mode;

        if (this.debug_mode === DEBUG_MODE_NONE) {
            this.stats_api.hide();
            this.data_display.hide();
        } else if (this.debug_mode === DEBUG_MODE_FPS) {
            this.stats_api.show();
            this.data_display.hide();
        } else {
            this.stats_api.show();
            this.data_display.show();
        }
    },

    _detect_if_mobile: function() {
        // from : https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.is_mobile = true;
        }
        this.check_vr();
    },

    pre_render: function() {
        if (this.debug_mode === DEBUG_MODE_FPS || this.debug_mode === DEBUG_MODE_FULL) {
            this.stats_api.pre_render();
        }
    },

    update: function() {
        if (this.debug_mode === DEBUG_MODE_FULL) {
            this.data_display.update();
        }
    },

    post_render: function() {
        if (this.debug_mode === DEBUG_MODE_FPS || this.debug_mode === DEBUG_MODE_FULL) {
            this.stats_api.post_render();
        }
    },

    check_vr: function() {
        if (navigator.getVRDisplays !== undefined) {
            navigator.getVRDisplays().then(function(displays) {
                if (displays.length === 0) {
                    this.is_vr = false;
                } else {
                    this.is_vr = false;
                }
            }.bind(this));
        } else {
            this.is_vr = true;
        }
    }

};