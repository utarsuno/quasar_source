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

        l(this.hexagon_geometry);

        this.single_geometry = new THREE.Geometry();

        this.materails = [];

        let layer;
        for (layer = 0; layer < this.number_of_layers; layer++) {
            let c = new THREE.MeshToonMaterial({color: Math.random() * 0xffffff});
            //let m = new THREE.Mesh(this.hexagon, c);

            let hexagon = new THREE.Geometry();
            hexagon.faceVertexUvs = this.hexagon_geometry.faceVertexUvs;
            hexagon.faces = this.hexagon_geometry.faces;

            this.materails.push(c);
            this.single_geometry.merge(hexagon);
        }

        let cc = new THREE.MeshToonMaterial({color: Math.random() * 0xffffff});

        this.object3D = new THREE.Object3D();
        this.single_mesh = new THREE.Mesh(this.single_geometry, cc);
        this.object3D.add(this.single_mesh);
    }

};