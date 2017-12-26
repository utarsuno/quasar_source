'use strict';

function ShaderAPI(scene, camera) {
    this.__init__(scene, camera);
}

ShaderAPI.prototype = {
    composer: null,
    render_pass: null,

    __init__: function(scene, camera) {
        // COMPOSER
        this.composer = new THREE.EffectComposer(MANAGER_RENDERER.renderer);

        // PASSES
        this.render_pass = new THREE.RenderPass(scene, camera);

        this.copy_pass = new THREE.ShaderPass(THREE.CopyShader);

        this.glitch_pass = new THREE.GlitchPass(0);

        this.composer.addPass(this.render_pass);
        this.composer.addPass(this.copy_pass);
        this.composer.addPass(this.glitch_pass);

        this.glitch_pass.renderToScreen = true;

        //this.render_pass.renderToScreen = true
    },

    render: function() {
        this.composer.render();
    }
};


/*
var material = new THREE.ShaderMaterial({
    vertex_shader: vertex_shader.vert text contents
    fragments_shader: fragment_shader.frag text contents
});
 */