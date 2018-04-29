'use strict';

function AudioGroup(loading_manager, fully_loaded_callback) {
    this.__init__(loading_manager, fully_loaded_callback);
}

AudioGroup.prototype = {

    __init__: function(loading_manager, fully_loaded_callback) {
        // Inherit.
        //AssetLoaderGroup.call(this, ASSET_GROUP_AUDIO, loading_manager, fully_loaded_callback);
        ManagerManager.prototype.AssetLoaderGroup.call(this, ASSET_GROUP_AUDIO, loading_manager, fully_loaded_callback);

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
        callback();
    }
};