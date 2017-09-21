'use strict'

function StatsAPI() {
    this.__init__()
}

StatsAPI.prototype = {
    stats_fps: null,
    stats_mb_allocated: null,

    // TODO : Make use of this state variable.
    enabled: null,

    __init__: function() {
        this.enabled = false

        // Create the 3rd party library objects.
        this.stats_fps            = new Stats()
        this.stats_mb_allocated   = new Stats()

        // Set the display mode.
        this.stats_fps.showPanel(0)
        this.stats_mb_allocated.showPanel(2)

        // Set the styling.
        this.stats_fps.domElement.style.position = 'absolute'
        this.stats_fps.domElement.style.left     = '0px'
        this.stats_fps.domElement.style.top      = '0px'

        this.stats_mb_allocated.domElement.style.position = 'absolute'
        this.stats_mb_allocated.domElement.style.left     = '80px'
        this.stats_mb_allocated.domElement.style.top      = '0px'

        this.add_to_document()
    },

    add_to_document: function() {
        document.body.appendChild(this.stats_fps.domElement)
        document.body.appendChild(this.stats_mb_allocated.domElement)
    },

    pre_render: function() {
        if (this.enabled) {
            this.stats_fps.begin()
            this.stats_mb_allocated.begin()
        }
    },

    post_render: function() {
        if (this.enabled) {
            this.stats_fps.end()
            this.stats_mb_allocated.end()
        }
    }
}
