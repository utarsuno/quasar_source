'use strict';

Object.assign($_QE.prototype.Client.prototype, {
    state_window_width_inner  : null,
    state_window_width_outer  : null,
    state_window_height_inner : null,
    state_window_height_outer : null,

    _fetch_window_dimensions: function() {
        this.state_window_width_inner  = window.innerWidth;
        this.state_window_width_outer  = window.outerWidth;
        this.state_window_height_inner = window.innerHeight;
        this.state_window_height_outer = window.outerHeight;
    },

    _on_window_resize: function() {
        this._fetch_window_dimensions();
        this.renderer.window_resize_event();
    },

    on_window_resize: function(event) {
        this._on_window_resize();
        event.preventDefault();
        event.stopPropagation();
    },
});
