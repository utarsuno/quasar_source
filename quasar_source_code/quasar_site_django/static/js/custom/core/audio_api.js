'use strict'

function AudioManager(player) {
    this.__init__(player)
}

AudioManager.prototype = {

    player        : null,

    // audio objects
    audio_listener: null,
    loader        : null,

    typing_sound: null,
    typing_sound_loaded: null,

    // SOUNDS TODO!!!
    hover_over_sound: null,
    hover_over_sound_loaded: null,

    // TODO : Add global audio controls

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
                this.typing_sound.setVolume(0.33)
                this.typing_sound_loaded = true


                WORLD_MANAGER.add_to_all_scenes(AUDIO_MANAGER.get_typing_sound())

            }.bind(this),

            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded for audio file.')
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened trying to load the audio file.')
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
    }

}

