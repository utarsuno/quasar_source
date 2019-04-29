'use strict';

/**
 * @author alteredq / http://alteredqualia.com/
 * ^ original author.
 *
 * MODIFICATIONS MADE!!!
 */

$_QE.prototype.ShaderPassNoise = function() {
    THREE.Pass.call(this);
    this.shader_material    = QE.manager_assets.get_asset(ASSET_SHADER_MATERIAL_NOISE);
    this.material           = this.shader_material.get_shader_material();
    // Avoid getting clipped
    this.quad.frustumCulled = false;

    this.scene.add(this.quad);
};


$_QE.prototype.ShaderPassNoise.prototype = Object.assign(Object.create(THREE.Pass.prototype), {

    constructor: $_QE.prototype.ShaderPassNoise,

    camera     : new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    scene      : new THREE.Scene(),
    quad       : new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null),

    render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
        this.shader_material.set_t_diffuse(readBuffer.texture);
        this.shader_material.add_time(delta);
        this.quad.material = this.material;
        if (this.renderToScreen) {
            renderer.render(this.scene, this.camera);
        } else {
            renderer.render(this.scene, this.camera, writeBuffer, this.clear);
        }
    }

});


Object.assign(
    $_QE.prototype,
    {
        _initialize_noise: function() {
            this.effect_noise = new $_QE.prototype.ShaderPassNoise();
            this.effect_noise.renderToScreen = true;
            this.effect_composer.addPass(this.effect_noise);


        },
    }
);
