'use strict'

function ShaderAPI(renderer_api, scene, camera) {
    this.__init__()
}

ShaderAPI.prototype = {
    composer: null,
    render_pass: null,

    __init__: function(renderer_api, scene, camera) {
        // COMPOSER
        this.composer = new THREE.EffectComposer(renderer_api.renderer)

        // PASSES
        this.render_pass = new THREE.RenderPass(scene, camera)
        this.composer.addPass(this.render_pass)

        // Glitch pass.
        this.glitch_pass = THREE.GlitchPass()
        this.composer.addPass(this.glitch_pass)

        this.render_pass.renderToScreen = true
    },

    render: function() {
        this.composer.render()
    }
}


/*
var material = new THREE.ShaderMaterial({
    vertex_shader: vertex_shader.vert text contents
    fragments_shader: fragment_shader.frag text contents
});
 */