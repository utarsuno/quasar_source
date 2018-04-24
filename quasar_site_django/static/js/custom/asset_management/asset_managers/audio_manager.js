'use strict';

const AUDIO_SOUND_TYPING       = 'typing_sound.ogg';     // #pre-process_global_constant
const AUDIO_SOUND_TRANSITION   = 'transition.ogg';       // #pre-process_global_constant
const AUDIO_SOUND_ERROR        = 'error.ogg';            // #pre-process_global_constant
const AUDIO_SOUND_ON_DISENGAGE = 'on_disengage.ogg';     // #pre-process_global_constant
const AUDIO_SOUND_ON_ENGAGE    = 'on_engage.ogg';        // #pre-process_global_constant
const AUDIO_SOUND_ON_HOVER     = 'on_hover.ogg';         // #pre-process_global_constant
const AUDIO_SOUND_SUCCESS      = 'success.ogg';          // #pre-process_global_constant
const AUDIO_SOUND_CHECKBOX     = 'checkbox_toggle.ogg';  // #pre-process_global_constant
const AUDIO_MUSIC_BACKGROUND   = 'background_music.ogg'; // #pre-process_global_constant

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
        this.audio_listener.setMasterVolume(this.get_true_audio_level(0.5));
        MANAGER_RENDERER.camera.add(this.audio_listener);

        this._all_audio = {};
    },

    // Important reference : https://imgur.com/gallery/J6WA6eo
    get_true_audio_level: function(audio_percentage) {
        return pow(audio_percentage, Math.E);
    },

    play_typing_sound: function() {
        this.play_sound(AUDIO_SOUND_TYPING);
    },

    play_sound: function(s) {
        if (this._all_audio[s].isPlaying) {
            this._all_audio[s].stop();
        }
        this._all_audio[s].play();
    },

    resume_background_music: function() {
        this._all_audio[AUDIO_MUSIC_BACKGROUND].play();
    },

    pause_background_music: function() {
        this._all_audio[AUDIO_MUSIC_BACKGROUND].pause();
    },

    set_audio: function(audio_name, audio_buffer) {
        MANAGER_AUDIO._set_audio(audio_name, audio_buffer);
    },

    _set_audio: function(audio_name, audio_buffer) {
        this._all_audio[audio_name] = new THREE.Audio(this.audio_listener);
        this._all_audio[audio_name].setBuffer(audio_buffer);

        if (audio_name === AUDIO_MUSIC_BACKGROUND) {
            this._all_audio[audio_name].setVolume(this.get_true_audio_level(0.5));
        }

        switch (audio_name) {
        case AUDIO_MUSIC_BACKGROUND:
            this._all_audio[audio_name].setVolume(this.get_true_audio_level(0.5));
            break;
        case AUDIO_SOUND_ON_HOVER:
            this._all_audio[audio_name].setVolume(this.get_true_audio_level(0.35));
            break;
        case AUDIO_SOUND_ON_ENGAGE:
            this._all_audio[audio_name].setVolume(this.get_true_audio_level(0.65));
            break;
        case AUDIO_SOUND_ON_DISENGAGE:
            this._all_audio[audio_name].setVolume(this.get_true_audio_level(0.65));
            break;
        case AUDIO_SOUND_TRANSITION:
            this._all_audio[audio_name].setVolume(this.get_true_audio_level(0.4));
            break;
        }
    },

    set_audio_for_world: function(world) {
        /*
        let audio;
        for (audio in this._all_audio) {
            if (this._all_audio.hasOwnProperty(audio)) {
                world.add_to_scene(this._all_audio[audio]);
            }
        }
        */
    }
};
