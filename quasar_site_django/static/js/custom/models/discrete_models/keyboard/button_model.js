'use strict';

function ButtonModel(letter, keyboard) {
    this.__init__(letter, keyboard);
}

ButtonModel.prototype = {

    __init__: function(letter, keyboard) {
        this.letter = letter;
        this.keyboard = keyboard;
    },

    create: function(key_width) {
        this.geometry = new THREE.Geometry();

        // Key face.
        let v0 = new THREE.Vector3(10, 10, 0);
        let v1 = new THREE.Vector3(10 + key_width, 10, 0);
        let v2 = new THREE.Vector3(10 + key_width, 10 + key_width, 0);
        let v3 = new THREE.Vector3(10, 10 + key_width, 0);

        // Key top edge.
        let v4 = new THREE.Vector3(0, 10 + key_width + 10, -10);
        let v5 = new THREE.Vector3(10 + key_width + 10, 10 + key_width + 10, -10);

        this.geometry.vertices.push(v0);
        this.geometry.vertices.push(v1);
        this.geometry.vertices.push(v2);
        this.geometry.vertices.push(v3);
        this.geometry.vertices.push(v4);
        this.geometry.vertices.push(v5);

        this.geometry.faces.push(new THREE.Face3(0, 1, 2));
        this.geometry.faces.push(new THREE.Face3(2, 3, 0));
        this.geometry.faces.push(new THREE.Face3(3, 5, 4));
        this.geometry.computeFaceNormals();

        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshNormalMaterial());
    }

};