'use strict';

$_QE.prototype.ClientFunctionalityWindowResize = function() {

    this._fetch_window_dimensions = function() {
        this.state_window_width_inner  = window.innerWidth;
        this.state_window_width_outer  = window.outerWidth;
        this.state_window_height_inner = window.innerHeight;
        this.state_window_height_outer = window.outerHeight;
    };

    this._on_window_resize = function() {
        this._fetch_window_dimensions();
        this.renderer.window_resize_event();
    };

    this.on_window_resize = function(event) {
        this._on_window_resize();
        event.preventDefault();
        event.stopPropagation();
    };

    window.addEventListener('resize', this.on_window_resize.bind(this), true);

};