'use strict'

// /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/css/custom/base.css

function GlobalAudio(player) {
    this.__init__(player)
}

GlobalAudio.prototype = {

    player        : null,

    // audio objects
    audio_listener: null,
    loader        : null,

    typing_sound: null,
    typing_sound_loaded: null,

    __init__: function(camera) {
        this.audio_listener = new THREE.AudioListener()
        camera.add(this.audio_listener)
        this.typing_sound = new THREE.Audio(this.audio_listener)

        this.typing_sound_loaded = false

        this.loader = new THREE.AudioLoader()
        this.loader.load(

            // resource URL
            '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/audio/typing_sound.wav',
            // Function when resource is loaded
            function (audio_buffer) {
                this.typing_sound.setBuffer(audio_buffer)
                this.typing_sound_loaded = true
                this.notify_player()
            }.bind(this),

            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' )
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' )
            }

        ).bind(this)
    },

    get_typing_sound: function() {
        return this.typing_sound
    },

    play_typing_sound: function() {
        this.typing_sound.play()
    },

    notify_player: function() {
        this.player.sounds_loaded()
    }

}
