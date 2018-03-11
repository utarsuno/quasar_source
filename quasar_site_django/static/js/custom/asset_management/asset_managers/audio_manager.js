'use strict';

// Important reference : https://imgur.com/gallery/J6WA6eo

function AudioManager() {
    this.__init__();
}

AudioManager.prototype = {

    // audio objects
    audio_listener: null,

    // TODO : Add global audio controls
    current_audio_level: null,

    __init__: function() {
        this.audio_listener = new THREE.AudioListener();
        this.audio_listener.setMasterVolume(this.get_true_audio_level(0.6));
        MANAGER_RENDERER.camera.add(this.audio_listener);

        this._all_audio = {};
    },

    get_true_audio_level: function(audio_percentage) {
        return pow(audio_percentage, Math.E);
    },

    play_typing_sound: function() {
        if (this._all_audio[AUDIO_TYPING_SOUND].isPlaying) {
            this._all_audio[AUDIO_TYPING_SOUND].stop();
        }
        this._all_audio[AUDIO_TYPING_SOUND].play();
    },

    set_audio: function(audio_name, audio_buffer) {
        this._all_audio[audio_name] = new THREE.Audio(this.audio_listener);
        this._all_audio[audio_name].setBuffer(audio_buffer);
    },

    set_audio_for_world: function(world) {
        for (var audio in this._all_audio) {
            if (this._all_audio.hasOwnProperty(audio)) {
                world.add_to_scene(this._all_audio[audio]);
            }
        }
    }
};
