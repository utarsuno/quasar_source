'use strict';

Object.assign(
    $_QE.prototype,
    {
        _update_fxaa: function() {
            if (this.flag_is_on(QEFLAG_SETTING_FXAA)) {
                this.effect_FXAA.uniforms['resolution'].value.set(1 / (this._cachei[QECACHEI_WIDTH_INNER] * window.devicePixelRatio), 1 / (this._cachei[QECACHEI_HEIGHT_INNER] * window.devicePixelRatio));
            }
        },

        _initialize_fxaa: function() {
            this.effect_FXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effect_FXAA.uniforms['resolution'].value.set(1 / (this._cachei[QECACHEI_WIDTH_INNER] * window.devicePixelRatio), 1 / (this._cachei[QECACHEI_HEIGHT_INNER] * window.devicePixelRatio));
            this.effect_composer.addPass(this.effect_FXAA);
        },
    }
);
