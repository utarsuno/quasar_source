'use strict';

Object.assign($_QE.prototype, {

    __init__resize: function() {
        this._fetch_window_size();
        window.addEventListener('resize', this._on_window_resize.bind(this), true);
    },

    _fetch_window_size: function() {
        this.set_width(window.innerWidth);
        this._cachei[QECACHEI_WIDTH_INNER]  = window.innerWidth;
        this._cachei[QECACHEI_WIDTH_OUTER]  = window.outerWidth;
        this.set_height(window.innerHeight);
        this._cachei[QECACHEI_HEIGHT_OUTER] = window.outerHeight;
        this._cachef[QECACHEF_ASPECT_RATIO] = this.get_width() / this.get_height();
    },

    _on_window_resize: function(event) {
        // TODO: Eventually throttle this event (only execute once no event is no longer sent for longer than 200 ms?).
        this._fetch_window_size();
        this._update_renderer_dimensions();
        event.preventDefault();
        event.stopPropagation();
    },

});
