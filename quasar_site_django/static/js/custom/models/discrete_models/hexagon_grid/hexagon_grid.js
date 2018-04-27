'use strict';

function HexagonGrid(number_of_layers) {
    this.__init__(number_of_layers);
}

HexagonGrid.prototype = {

    __init__: function(number_of_layers) {
        this.number_of_layers = number_of_layers;


        // Creation directions.
        this.d_top_left = 1;
        this.d_bottom_left = 2;
        this.d_down = 3;
        this.d_bottom_right = 4;
        this.d_top_right = 5;
        this.d_top = 6;
    },

    _get_x_offset: function(d) {
        switch(d) {
        case 1:
            return -64;
            break;
        case 2:
            return -64;
            break;
        case 3:
            return 0;
            break;
        case 4:
            return 64;
            break;
        case 5:
            return 64;
            break;
        case 6:
            return 0;
            break;
        }
    },

    _get_y_offset: function(d) {
        switch(d) {
        case 1:
            return 64;
            break;
        case 2:
            return -64;
            break;
        case 3:
            return -128;
            break;
        case 4:
            return 64;
            break;
        case 5:
            return 64;
            break;
        case 6:
            return 128;
            break;
        }
    },

    create: function() {
        this.hexagon_geometry = new THREE.CircleGeometry(64, 6);
        this.single_geometry = new THREE.Geometry();
        this.materails = [];

        this.create_tile(0, 0, 0);
        this.create_tile(64, 64, 1);

        this.object3D = new THREE.Object3D();
        this.single_mesh = new THREE.Mesh(this.single_geometry, this.materails);
        this.object3D.add(this.single_mesh);

        this.object3D.lookAt(0, 1, 0);
    },

    createOLD: function() {
        let w = 64;
        let s = 32;

        this.hexagon_geometry = new THREE.CircleGeometry(64, 6);

        this.single_geometry = new THREE.Geometry();

        this.materails = [];

        let tile = 0;

        let layer;
        for (layer = 0; layer < this.number_of_layers; layer++) {
            if (layer === 0) {
                this.create_tile(0, 0, tile);
                tile += 1;
            } else {
                let number_of_tiles = layer * 6;

                let gap = layer - 1;
                let direction = this.d_top_right;
                let filled = 0;

                let offset_x = this._get_x_offset(direction);
                let offset_y = this._get_y_offset(direction);

                direction = this.d_top_left;

                let i = 1;
                while (i < number_of_tiles + 1) {
                    offset_x += this._get_x_offset(direction);
                    offset_y += this._get_y_offset(direction);

                    this.create_tile(offset_x, offset_y, tile);
                    tile += 1;

                    if (filled === gap) {
                        direction += 1;
                    } else {
                        filled += 1;
                    }

                    i += 1;
                }
            }
        }

        let cc = new THREE.MeshToonMaterial({color: Math.random() * 0xffffff});

        this.object3D = new THREE.Object3D();
        this.single_mesh = new THREE.Mesh(this.single_geometry, this.materails);
        this.object3D.add(this.single_mesh);

        this.object3D.lookAt(0, 1, 0);
    },

    create_tile: function(x_offset, y_offset, material_index) {
        let c = new THREE.MeshToonMaterial({color: Math.random() * 0xffffff});

        let hexagon = new THREE.Geometry();
        hexagon.vertices = this.hexagon_geometry.vertices;
        hexagon.faceVertexUvs = this.hexagon_geometry.faceVertexUvs;
        hexagon.faces = this.hexagon_geometry.faces;

        l('Creating tile {' + x_offset + '} - {' + y_offset + '}');
        hexagon.translate(x_offset, y_offset, material_index * 5);

        this.materails.push(c);
        this.single_geometry.merge(hexagon, hexagon.matrix, material_index);
    }

};