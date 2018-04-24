'use strict';

function SVGGroup(texture_group, loading_manager, fully_loaded_callback) {
    this.__init__(texture_group, loading_manager, fully_loaded_callback);
}

SVGGroup.prototype = {

    __init__: function(loading_manager, fully_loaded_callback) {
        // Inherit.
        AssetGroup.call(this, ASSET_GROUP_SVG, loading_manager, fully_loaded_callback);

        this.image_canvas = document.createElement('canvas');
    },

    _svg_loaded: function(svg, asset_name) {
        l('Loaded');
        l(asset_name);
        l(svg);

        canvg(this.image_canvas, svg);

        this.texture = new THREE.Texture(this.image_canvas);
        this.texture.needsUpdate = true;
        l(this.texture);

        MANAGER_SVG.set_icon(asset_name, this.texture);

        this._asset_loaded(asset_name);
    },

    load_assets: function() {

        let asset;
        for (asset in this._assets) {
            if (this._assets.hasOwnProperty(asset)) {
                let path = this._asset_base_url + asset;
                l(path);
                this._svg_loaded(path, path);
            }
        }


        //let asset;
        for (asset in this._assets) {
            if (this._assets.hasOwnProperty(asset)) {

                let loader = new THREE.SVGLoader();
                loader.load(this._asset_base_url + asset,

                    function(path) {
                        //this._svg_loaded(arguments[1], arguments[0]);
                    }.bind(this, asset),

                    function(xhr) {
                        // On success load.
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
        this._add_required_initial_asset(SVG_CLICK_ICON);
        callback();
    }
};