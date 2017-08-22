'use strict'

function StatsAPI() {}

StatsAPI.prototype = {
    initialize: function() {
        // Create the 3rd party library objects.
        this.stats_fps            = new Stats()
        this.stats_ms_render_time = new Stats()
        this.stats_mb_allocated   = new Stats()

        // Set the display mode.
        this.stats_fps.showPanel(0)
        this.stats_ms_render_time.showPanel(1)
        this.stats_mb_allocated.showPanel(2)

        // Add the CSS IDs for positioning.
        this.stats_fps.domElement.id            = 'stats_fps'
        this.stats_ms_render_time.domElement.id = 'stats_ms_render_time'
        this.stats_mb_allocated.domElement.id   = 'stats_mb_allocated'

    },
	add_to_document: function(document) {
        document.body.appendChild(this.stats_fps)
        document.body.appendChild(this.stats_ms_render_time)
        document.body.appendChild(this.stats_mb_allocated)
	},
	pre_render: function() {
        this.stats_fps.begin()
        this.stats_ms_render_time.begin()
        this.stats_mb_allocated.begin()
    },
    post_render: function() {
        this.stats_fps.end()
        this.stats_ms_render_time.end()
        this.stats_mb_allocated.end()
    }
}
