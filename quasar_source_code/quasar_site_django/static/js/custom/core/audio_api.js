'use strict'

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

    // SOUNDS TODO!!!
    hover_over_sound: null,
    hover_over_sound_loaded: null,

    __init__: function(player) {
        this.player = player
        this.audio_listener = new THREE.AudioListener()
        this.player.camera.add(this.audio_listener)
        this.typing_sound = new THREE.Audio(this.audio_listener)

        this.typing_sound_loaded = false

        this.loader = new THREE.AudioLoader()
        this.loader.load(

            // resource URL
            '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/audio/typing_sound.wav',
            // Function when resource is loaded
            function (audio_buffer) {
                this.typing_sound.setBuffer(audio_buffer)
                this.typing_sound.setVolume(0.5)
                this.typing_sound_loaded = true
                this.notify_player()
            }.bind(this),

            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened')
            }

        )
    },

    get_typing_sound: function() {
        return this.typing_sound
    },

    play_typing_sound: function() {
        if (this.typing_sound_loaded) {
            if (this.typing_sound.isPlaying) {
                this.typing_sound.stop()
            }
            this.typing_sound.play()
        }
    },

    // TODO : FUNCTIONS - get_hover_over_sound and play_hover_over_sound

    notify_player: function() {
        this.player.sounds_loaded()
    }

}
