'use strict';

// Needed for the file loader to work (for shaders). TODO : Add better documentation.
THREE.Cache.enabled = true;

ManagerManager.prototype.set_loading_manager = function() {
    function LoadingManager() {
        this.__init__();
    }
    LoadingManager.prototype = {
        __init__: function() {
            this._number_of_resources_to_load   = 0;
            this._number_of_resources_loaded    = 0;
            this._number_of_asset_groups_loaded = 0;

            this.asset_groups = [];

            this.loader_finished_callback = this.check_if_initial_resources_loaded.bind(this);
        },

        asset_loaded: function(asset) {
            this._number_of_resources_loaded += 1;
            let text = int((this._number_of_resources_loaded / this._number_of_resources_to_load) * 100.0) + '%';
            let sub_text = 'loaded : ' + asset;
            CURRENT_CLIENT.set_pause_menu_text_and_sub_text(text, sub_text);
        },

        /*__             __        __              ___                      __        __          __
         /  \ |  |  /\  /__`  /\  |__)    | |\ | |  |  |  /\  |       |    /  \  /\  |  \ | |\ | / _`
         \__X \__/ /~~\ .__/ /~~\ |  \    | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ | | \| \__> */
        perform_initial_load: function(initial_asset_loading_completed_callback) {
            this.initial_asset_loading_completed_callback = initial_asset_loading_completed_callback;

            let asset_group;
            for (asset_group = 0; asset_group < this.asset_groups.length; asset_group++) {
                this.asset_groups[asset_group].load_assets();
            }
        },

        check_if_initial_resources_loaded: function() {
            if (this._number_of_asset_groups_loaded === this.asset_groups.length) {
                this.initial_asset_loading_completed_callback();
            }
        },

        // FOR_QA_START
        currently_loading: function() {
            return this._number_of_resources_loaded !== this._number_of_resources_to_load;
        }
        // FOR_QA_END
    };

    this.manager_loading = new LoadingManager();
    this.set_audio_loader(this.manager_loading);
    this.set_texture_loader(this.manager_loading);
};