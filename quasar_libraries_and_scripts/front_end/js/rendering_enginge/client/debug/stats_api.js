'use strict';

$_CQE.prototype.ClientStatsAPI = function() {
    // Create the 3rd party library objects.
    this.stats_fps = new Stats();

    // Set the display mode.
    this.stats_fps.showPanel(0);

    this.element = new $_CQE.prototype.DomElement(null, this.stats_fps.domElement);
    this.element.set_id('fps_display');

    this.add_to_document = function() {
        document.body.appendChild(this.stats_fps.domElement);
    };

    this.hide = function() {
        this.element.hide();
    };

    this.show = function() {
        this.element.show();
    };

    this.pre_render = function() {
        this.stats_fps.begin();
    };

    this.post_render = function() {
        this.stats_fps.end();
    };

    this.add_to_document();
};

/*
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

        this.element = new DomElement(null, this.stats_fps.domElement);
        this.element.set_id('fps_display');

        this.add_to_document();
    },

    add_to_document: function() {
        document.body.appendChild(this.stats_fps.domElement);
    },

    hide: function() {
        this.element.hide();
    },

    show: function() {
        this.element.show();
    },

    pre_render: function() {
        this.stats_fps.begin();
    },

    post_render: function() {
        this.stats_fps.end();
    }
};
*/