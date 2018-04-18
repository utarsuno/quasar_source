'use strict';

function StatsAPI() {
    this.__init__();
}

StatsAPI.prototype = {
    stats_fps: null,

    __init__: function() {
        // Create the 3rd party library objects.
        this.stats_fps = new Stats();

        // Set the display mode.
        this.stats_fps.showPanel(0);

        // Set the styling.
        this.stats_fps.domElement.style.position = 'absolute';
        this.stats_fps.domElement.style.left     = '0px';
        this.stats_fps.domElement.style.top      = '0px';

        this.add_to_document();
    },

    add_to_document: function() {
        document.body.appendChild(this.stats_fps.domElement);
    },

    hide: function() {
        this.stats_fps.domElement.style.display = DISPLAY_NONE;
    },

    show: function() {
        this.stats_fps.domElement.style.display = DISPLAY_SHOW;
    },

    pre_render: function() {
        this.stats_fps.begin();
    },

    post_render: function() {
        this.stats_fps.end();
    }
};
