'use strict'

function StatsAPI() {
    this.initialize()
}

StatsAPI.prototype = {
    stats_fps: null,
    stats_ms_render_time: null,
    stats_mb_allocated: null,
    initialize: function() {
        console.log('Constructor called!')

        // Create the 3rd party library objects.
        this.stats_fps            = new Stats()
        this.stats_ms_render_time = new Stats()
        this.stats_mb_allocated   = new Stats()

        // Set the display mode.
        this.stats_fps.showPanel(0)
        this.stats_ms_render_time.showPanel(1)
        this.stats_mb_allocated.showPanel(2)

        // Set the styling.
        this.stats_fps.domElement.style.position = 'absolute'
        this.stats_fps.domElement.style.left     = '0px'
        this.stats_fps.domElement.style.top      = '0px'

        this.stats_ms_render_time.domElement.style.position = 'absolute'
        this.stats_ms_render_time.domElement.style.left     = '80px'
        this.stats_ms_render_time.domElement.style.top      = '0px'

        this.stats_mb_allocated.domElement.style.position = 'absolute'
        this.stats_mb_allocated.domElement.style.left     = '160px'
        this.stats_mb_allocated.domElement.style.top      = '0px'
    },
	add_to_document: function(document) {
        console.log(this.stats_fps)
        document.body.appendChild(this.stats_fps.domElement)
        document.body.appendChild(this.stats_ms_render_time.domElement)
        document.body.appendChild(this.stats_mb_allocated.domElement)
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
