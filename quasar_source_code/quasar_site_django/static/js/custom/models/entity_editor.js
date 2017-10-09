'use strict'

function EntityEditor() {
    this.__init__()
}

EntityEditor.prototype = {

    object_3d: null,

    __init__: function() {
        this.object_3d = new THREE.Object3D()
    }
}