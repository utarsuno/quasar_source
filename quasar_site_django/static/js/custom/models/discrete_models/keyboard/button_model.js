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

        // Face.
        let v0 = new THREE.Vector3(10, 10, 0);
        let v1 = new THREE.Vector3(10 + key_width, 10, 0);
        let v2 = new THREE.Vector3(10 + key_width, 10 + key_width, 0);
        let v3 = new THREE.Vector3(10, 10 + key_width, 0);
        // Top left.
        let v4 = new THREE.Vector3(0, 10 + key_width + 10, -10);
        // Top right.
        let v5 = new THREE.Vector3(10 + key_width + 10, 10 + key_width + 10, -10);
        // Bottom right.
        let v6 = new THREE.Vector3(10 + key_width + 10, 0, -10);
        // Bottom left.
        let v7 = new THREE.Vector3(0, 10 + key_width + 10, -10);

        // Face.
        this.geometry.vertices.push(v0);
        this.geometry.vertices.push(v1);
        this.geometry.vertices.push(v2);
        this.geometry.vertices.push(v3);
        // Top left.
        this.geometry.vertices.push(v4);
        // Top right.
        this.geometry.vertices.push(v5);
        // Right edge.
        this.geometry.vertices.push(v6);
        // Bottom left.
        this.geometry.vertices.push(v7);

        // Face.
        this.geometry.faces.push(new THREE.Face3(0, 1, 2));
        this.geometry.faces.push(new THREE.Face3(2, 3, 0));
        // Top edge.
        this.geometry.faces.push(new THREE.Face3(3, 5, 4));
        this.geometry.faces.push(new THREE.Face3(3, 2, 5));
        // Right edge.


        this.geometry.computeFaceNormals();

        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshNormalMaterial());
    }

};