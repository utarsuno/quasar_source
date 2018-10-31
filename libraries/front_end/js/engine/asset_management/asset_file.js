'use strict';

$_QE.prototype.AssetFile = function(name, asset_type, depends_on) {
    this.name       = name;
    this.type       = asset_type;
    this.depends_on = depends_on;
};

$_QE.prototype.AssetFile.prototype = {

    load_asset: function() {
        let me = this;

        switch(this.type) {
        case ASSET_TYPE_TEXTURE:
            return new Promise(function(resolve, reject) {
                let loader = new THREE.TextureLoader();
                loader.load('/v/' + me.name,
                    function(asset_data) {
                        //l('LOADING {' + ('/a/' + me.name) + '}');
                        QE.manager_assets.on_asset_load(me.name, asset_data);
                        resolve();
                    },
                    undefined,
                    function(error) {
                        QE.fatal_error('loading {' + me.name + '}');
                        reject(error);
                    }
                );
            });
        case ASSET_TYPE_SHADER_MATERIAL:
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
                case ASSET_SHADER_MATERIAL_BACKGROUND:
                    QE.manager_assets.on_asset_load(me.name, new $_QE.prototype.ShaderMaterialBackground());
                    resolve();
                    break;
                }
            });
        }
    },

};

