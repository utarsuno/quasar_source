'use strict';

ManagerManager.prototype.set_audio_loader = function(loading_manager) {
    function AudioLoader(loading_manager) {
        this.__init__(loading_manager);
    }

    AudioLoader.prototype = {

        __init__: function(loading_manager) {
            // Inherit.
            ManagerManager.prototype.AssetLoaderGroup.call(this, ASSET_GROUP_AUDIO, loading_manager);

            this.loader_class = THREE.AudioLoader;
            this.send_asset_to = MANAGER_AUDIO.set_audio;
        },

        /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
         | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
         | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
        _add_required_initial_assets: function(callback) {
            this._add_required_initial_asset(AUDIO_SOUND_TYPING);
            this._add_required_initial_asset(AUDIO_SOUND_TRANSITION);
            this._add_required_initial_asset(AUDIO_SOUND_ERROR);
            this._add_required_initial_asset(AUDIO_SOUND_ON_DISENGAGE);
            this._add_required_initial_asset(AUDIO_SOUND_ON_ENGAGE);
            this._add_required_initial_asset(AUDIO_SOUND_ON_HOVER);
            this._add_required_initial_asset(AUDIO_SOUND_SUCCESS);
            this._add_required_initial_asset(AUDIO_SOUND_CHECKBOX);
            this._add_required_initial_asset(AUDIO_MUSIC_BACKGROUND);
            MANAGER_AUDIO.set_number_of_total_assets(this._number_of_assets_to_load);
            callback();
        },

        get_asset_path_name: function(asset) {
            switch(asset) {
            case AUDIO_SOUND_TYPING:
                return 'typing_sound.ogg';
            case AUDIO_SOUND_TRANSITION:
                return 'transition.ogg';
            case AUDIO_SOUND_ERROR:
                return 'error.ogg';
            case AUDIO_SOUND_ON_DISENGAGE:
                return 'on_disengage.ogg';
            case AUDIO_SOUND_ON_ENGAGE:
                return 'on_engage.ogg';
            case AUDIO_SOUND_ON_HOVER:
                return 'on_hover.ogg';
            case AUDIO_SOUND_SUCCESS:
                return 'success.ogg';
            case AUDIO_SOUND_CHECKBOX:
                return 'checkbox_toggle.ogg';
            case AUDIO_MUSIC_BACKGROUND:
                return 'background_music.ogg';
            }
        }
    };

    this.audio_loader = new AudioLoader(loading_manager);
};