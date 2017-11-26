'use strict';

function AudioManager() {
    this.__init__();
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
    current_audio_level: null,

    __init__: function() {
        this.audio_listener = new THREE.AudioListener();
        CURRENT_PLAYER.camera.add(this.audio_listener);
        this.typing_sound = new THREE.Audio(this.audio_listener);

        this.typing_sound_loaded = false;

        this.loader = new THREE.AudioLoader();
        this.loader.load(

            // resource URL
            '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/audio/typing_sound.wav',
            // Function when resource is loaded
            function (audio_buffer) {
                this.typing_sound.setBuffer(audio_buffer);
                this.typing_sound.setVolume(0.33);
                this.typing_sound_loaded = true;

                MANAGER_WORLD.add_to_all_scenes(MANAGER_AUDIO.get_typing_sound());
            }.bind(this),

            // Function called when download progresses
            function (xhr) {
                // FOR_DEV_START
                l((xhr.loaded / xhr.total * 100) + '% loaded for audio file.');
                // FOR_DEV_END
            },
            // Function called when download errors
            function (xhr) {
                // FOR_DEV_START
                l('An error happened trying to load the audio file.');
                // FOR_DEV_END
            }

        );
    },

    get_typing_sound: function() {
        return this.typing_sound;
    },

    play_typing_sound: function() {
        if (this.typing_sound_loaded) {
            if (this.typing_sound.isPlaying) {
                this.typing_sound.stop();
            }
            this.typing_sound.play();
        }
    }
};

