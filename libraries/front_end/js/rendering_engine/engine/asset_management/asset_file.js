'use strict';

$_QE.prototype.AssetFile = function(name, asset_type, depends_on) {

    this.name       = name;
    this.type       = asset_type;
    this.depends_on = depends_on;

    this.load_asset = function() {
        let me = this;
        if (this.type === ASSET_TYPE_TEXTURE) {

            return new Promise(function(resolve, reject) {
                let loader = new THREE.TextureLoader();
                loader.load('/assets/' + me.name,
                    function(asset_data) {
                        QE.manager_assets.on_asset_load(me.name, asset_data);
                        resolve();
                    },
                    undefined,
                    function(error) {
                        QE.client.show_error('Error' + EMOJI_ERROR, 'loading {' + me.name + '}');
                        reject(error);
                    }
                );
            });

        } else if (this.type === ASSET_TYPE_SHADER_MATERIAL) {

            return new Promise(function(resolve) {
                switch(me.name) {
                case ASSET_SHADER_MATERIAL_TRANSITION:
                    QE.manager_assets.on_asset_load(me.name, new $_QE.prototype.ShaderMaterialTransition());
                    resolve();
                    break;
                case ASSET_SHADER_MATERIAL_NOISE:
                    QE.manager_assets.on_asset_load(me.name, new $_QE.prototype.ShaderMaterialNoise());
                    resolve();
                    break;
                case ASSET_SHADER_MATERIAL_SPRITE_SHEET:
                    QE.manager_assets.on_asset_load(me.name, new $_QE.prototype.ShaderMaterialSpriteSheet());
                    resolve();
                    break;
                }
            });

        }
    };
};
