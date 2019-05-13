$_QE.prototype.ShaderMaterialBackground = function() {

    let uniforms = {
        aspect: { type: 'f', value: QE.get_aspect_ratio() },
        grainScale: { type: 'f', value: QE.get_grain_scale() },
        grainTime: { type: 'f', value: 0 },
        noiseAlpha: { type: 'f', value: 0.25 },
        offset: { type: 'v2', value: new THREE.Vector2(0, 0) },
        scale: { type: 'v2', value: new THREE.Vector2(1, 1) },
        smooth: { type: 'v2', value: new THREE.Vector2(0.0, 1.0) },
        color1: { type: 'c', value: QE.COLOR_BACKGROUND_INNER },
        color2: { type: 'c', value: QE.COLOR_BACKGROUND_OUTER }
    };

    this.shader_material = new THREE.RawShaderMaterial({
        vertexShader  : QE.manager_assets.shader_background_vertex,
        fragmentShader: QE.manager_assets.shader_background_fragment,
        side          : THREE.FrontSide,
        depthTest     : false,
        uniforms      : uniforms
    });
};

Object.assign(
    $_QE.prototype.ShaderMaterialBackground.prototype,
    $_QE.prototype.ShaderMaterialAbstraction.prototype,
    {
        set_grain_scale: function(v) {
            this.set_uniform(SHADER_UNIFORM_BACKGROUND_GRAIN_TIME, v);
        },

        set_aspect: function(v) {
            this.set_uniform(SHADER_UNIFORM_BACKGROUND_ASPECT, v);
        },
    }
);
