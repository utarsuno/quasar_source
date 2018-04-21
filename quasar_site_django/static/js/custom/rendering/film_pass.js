'use strict';

/**
 * @author alteredq / http://alteredqualia.com/
 * ^ original author.
 *
 * MODIFICATIONS MADE!!!
 */

function FilmNoise() {
    THREE.Pass.call(this);
    this.material = MANAGER_SHADER.get_shader_material_abstraction(SHADER_MATERIAL_NOISE);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene  = new THREE.Scene();

    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    this.quad.frustumCulled = false; // Avoid getting clipped
    this.scene.add(this.quad);
}

FilmNoise.prototype = Object.assign(Object.create(THREE.Pass.prototype), {

    constructor: FilmNoise,

    render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
    	this.shader_material.set_t_diffuse(readBuffer.texture);
    	this.shader_material.add_time(delta);
    	this.quad.material = this.shader_material;
    	if (this.renderToScreen) {
    		renderer.render(this.scene, this.camera);
    	} else {
    		renderer.render(this.scene, this.camera, writeBuffer, this.clear);
    	}
    }

});