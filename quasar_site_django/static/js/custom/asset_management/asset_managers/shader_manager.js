'use strict';

const SHADER_TRANSITION_FRAGEMENT = 'transition/transition_fragment.frag';
const SHADER_TRANSITION_VERTEX    = 'transition/transition_vertex.vert';

function ShaderManager() {
    this.__init__();
}

ShaderManager.prototype = {

    __init__: function() {
        this._all_shaders = {};
    },

    set_shader: function(shader_name, shader_content) {
        this._all_shaders[shader_name] = shader_content;
    },

    get_shader: function(shader_name) {
        return this._all_shaders[shader_name];
    }
};