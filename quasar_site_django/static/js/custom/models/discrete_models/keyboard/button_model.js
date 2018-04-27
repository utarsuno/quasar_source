'use strict';

function ButtonModel(letter, keyboard) {
    this.__init__(letter, keyboard);
}

ButtonModel.prototype = {

    __init__: function(letter, keyboard) {
        this.letter = letter;
        this.keyboard = keyboard;
    },

    create: function(key_depth, face_height, key_width, x_offset, y_offset) {
        this.geometry = new THREE.Geometry();

        // Face.
        let v0 = new THREE.Vector3(key_depth, key_depth, 0);
        let v1 = new THREE.Vector3(key_depth + key_width, key_depth, 0);
        let v2 = new THREE.Vector3(key_depth + key_width, key_depth + face_height, 0);
        let v3 = new THREE.Vector3(key_depth, key_depth + face_height, 0);
        // Top left.
        let v4 = new THREE.Vector3(0, key_depth * 2 + face_height, -key_depth);
        // Top right.
        let v5 = new THREE.Vector3(key_depth * 2 + key_width, key_depth * 2 + face_height, -key_depth);
        // Bottom right.
        let v6 = new THREE.Vector3(key_depth * 2 + key_width, 0, -key_depth);
        // Bottom left.
        let v7 = new THREE.Vector3(0, 0, -key_depth);

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
        this.geometry.faces.push(new THREE.Face3(2, 6, 5));
        this.geometry.faces.push(new THREE.Face3(2, 1, 6));
        // Bottom edge.
        this.geometry.faces.push(new THREE.Face3(7, 6, 1));
        this.geometry.faces.push(new THREE.Face3(7, 1, 0));
        // Left edge.
        this.geometry.faces.push(new THREE.Face3(7, 0, 3));
        this.geometry.faces.push(new THREE.Face3(3, 4, 7));

        this.geometry.computeFaceNormals();

        //this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshNormalMaterial());
        //this.mesh = new THREE.Mesh(this.geometry);

        //let x = this.mesh.position.x;
        //let y = this.mesh.position.y;
        //this.mesh.position.setX(x + x_offset);
        //this.mesh.position.setY(y + y_offset);
    }

};