'use strict';

function HexagonGrid(number_of_layers) {
    this.__init__(number_of_layers);
}

HexagonGrid.prototype = {

    __init__: function(number_of_layers) {
        this.number_of_layers = number_of_layers;
    },

    create: function() {
        this.hexagon_geometry = new THREE.CircleGeometry(64, 6);
        this.single_geometry = new THREE.Geometry();

        this.materails = [];

        let l;
        for (l = 0; l < this.number_of_layers; l++) {
            let c = new THREE.MeshToonMaterial({color: Math.random() * 0xffffff});
            let m = new THREE.Mesh(this.hexagon_geometry, c);
            this.materails.push(m);
            this.single_geometry.merge(m);
        }

        this.object3D = new THREE.Object3D();
        this.single_mesh = new THREE.Mesh(this.single_geometry, this.materails);
        this.object3D.add(this.single_mesh);
    }

};