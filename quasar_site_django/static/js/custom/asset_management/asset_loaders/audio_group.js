'use strict';

function AudioGroup(loading_manager, fully_loaded_callback) {
    this.__init__(loading_manager, fully_loaded_callback);
}

AudioGroup.prototype = {

    __init__: function(loading_manager, fully_loaded_callback) {
        // Inherit.
        AssetGroup.call(this, ASSET_GROUP_AUDIO, loading_manager, fully_loaded_callback);
    },

    _audio_buffer_loaded: function(audio_buffer, asset_name) {
        MANAGER_AUDIO.set_audio(asset_name, audio_buffer);

        this._asset_loaded(asset_name);
    },

    load_audio_buffers: function() {
        for (var asset in this._assets) {
            if (this._assets.hasOwnProperty(asset)) {

                var loader = new THREE.AudioLoader();
                loader.load(this._asset_base_url + asset,

                    function (audio_buffer) {
                        this._audio_buffer_loaded(arguments[1], arguments[0]);
                    }.bind(this, asset),

                    function (xhr) {
                        // On load % success.
                    },

                    function(xhr) {
                        l('Error loading asset : ' + arguments[0]);
                    }.bind(this, asset)

                );

            }
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
    _add_required_initial_assets: function(callback) {
        this._add_required_initial_asset(AUDIO_TYPING_SOUND);
        callback();
    }
};
