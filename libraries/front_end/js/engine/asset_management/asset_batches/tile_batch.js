'use strict';

Object.assign(
    $_QE.prototype.AssetManager.prototype,
    {

        _load_tile_batch: function(asset_batch) {
            asset_batch.add_asset_texture(ASSET_TEXTURE_TILE_COLOR);
            asset_batch.add_asset_texture(ASSET_TEXTURE_TILE_DISPLACMENT);
            asset_batch.add_asset_texture(ASSET_TEXTURE_TILE_NORMAL);
            asset_batch.add_asset_texture(ASSET_TEXTURE_TILE_OCCULANT);
            asset_batch.add_asset_texture(ASSET_TEXTURE_TILE_ROUGH);
        },

    }
);
