'use strict';

function HexagonGrid(number_of_layers) {
    this.__init__(number_of_layers);
}

HexagonGrid.prototype = {

    __init__: function(number_of_layers) {
        this.number_of_layers = number_of_layers;

        this.h = 55.42562484741211;
        this.w_distance = Math.sqrt(3 * this.h * this.h);
    },

    create: function() {
        this.hexagon_geometry = new THREE.CircleGeometry(64, 6);
        this.single_geometry = new THREE.Geometry();
        this.materails = [];

        let h = 55.42562484741211;

        let w_distance = Math.sqrt(3 * h * h);

        this._create_tile(0, 0, 0);
        let tile = 1;

        let layer;
        for (layer = 1; layer < this.number_of_layers; layer++) {
            let number_of_tiles = layer * 6;

            let gap = layer - 1;
            let direction = 1;
            let filled = gap;

            let offset_x = this._get_x_offset(direction) * gap;
            let offset_y = this._get_y_offset(direction) * gap;

            let i = 1;
            while (i < number_of_tiles + 1) {
                offset_x += this._get_x_offset(direction);
                offset_y += this._get_y_offset(direction);

                this._create_tile(offset_x, offset_y, tile);
                tile += 1;

                if (filled === gap) {
                    direction += 1;
                    filled = 0;
                    if (direction > 7) {
                        direction = 1;
                    }
                } else {
                    filled += 1;
                }
                i += 1;
            }
        }

        this.object3D = new THREE.Object3D();

        let cc = new THREE.MeshPhongMaterial({color: COLOR_TILE_0});

        this.single_geometry.computeFaceNormals();
        this.single_geometry.computeVertexNormals();

        this.single_mesh = new THREE.Mesh(this.single_geometry, this.materails);
        //this.single_mesh = new THREE.Mesh(this.single_geometry, cc);

        this.object3D.add(this.single_mesh);

        this.object3D.lookAt(0, 1, 0);

        this.object3D.scale(2, 1, 2);

        //cc.emissive = COLOR_RED;
        cc.needsUpdate = true;
    },

    _create_tile: function(x_offset, y_offset, material_offset) {
        let tile = new THREE.Geometry();

        let v0 = new THREE.Vector3(0, 0, 0);
        let v1 = new THREE.Vector3(64, 0, 0);
        let v2 = new THREE.Vector3(32, 55.42562484741211, 0);
        let v3 = new THREE.Vector3(-32, 55.42562484741211, 0);
        let v4 = new THREE.Vector3(-64, 0, 0);
        let v5 = new THREE.Vector3(-32, -55.42562484741211, 0);
        let v6 = new THREE.Vector3(32, -55.42562484741211, 0);

        tile.vertices.push(v0);
        tile.vertices.push(v1);
        tile.vertices.push(v2);
        tile.vertices.push(v3);
        tile.vertices.push(v4);
        tile.vertices.push(v5);
        tile.vertices.push(v6);

        tile.faces.push(new THREE.Face3(1, 2, 0));
        tile.faces.push(new THREE.Face3(2, 3, 0));
        tile.faces.push(new THREE.Face3(3, 4, 0));
        tile.faces.push(new THREE.Face3(4, 5, 0));
        tile.faces.push(new THREE.Face3(5, 6, 0));
        tile.faces.push(new THREE.Face3(6, 1, 0));

        //let color = this._get_random_color();
        //l(color);
        let c = new THREE.MeshLambertMaterial({color: this._get_random_grey()});
        c.needsUpdate = true;
        //c.emssive = c.emissive.getHex();
        //c.emissive = null;
        this.materails.push(c);

        let m = new THREE.Matrix4();
        m.makeTranslation(x_offset, y_offset, 0);
        //m.makeRotationAxis(new THREE.Vector3(1, 0, 0), .0174532925 * 90);
        //m.makeTranslation(x_offset, y_offset, 5 * material_offset);

        //tile.applyMatrix(m);

        this.single_geometry.merge(tile, m, material_offset);

    },

    _get_random_grey: function() {
        let r = 20 + Math.floor(Math.random() * 10);
        let g = 20 + Math.floor(Math.random() * 10);
        let b = 20 + Math.floor(Math.random() * 10);
        let color = 'rgb(' + parseInt(r) + ',' + parseInt(g) + ',' + parseInt(b) + ')';
        return color;
    },

    _get_random_color: function() {
        let r = Math.floor(Math.random() * 6);
        l(r);
        switch(r) {
        case 0:
            return COLOR_TILE_0;
        case 1:
            return COLOR_TILE_1;
        case 2:
            return COLOR_TILE_2;
        case 3:
            return COLOR_TILE_3;
        case 4:
            return COLOR_TILE_4;
        case 5:
            return COLOR_TILE_5;
        }
    },

    _get_x_offset: function(d) {
        switch(d) {
        case 1:
            return 0;
        case 2:
            return -this.w_distance;
        case 3:
            return 0;
        case 4:
            return this.w_distance;
        case 5:
            return this.w_distance;
        case 6:
            return 0;
        case 7:
            return -this.w_distance;
        }
    },

    _get_y_offset: function(d) {
        switch(d) {
        case 1:
            return this.h * 2;
        case 2:
            return -this.h;
        case 3:
            return -this.h * 2;
        case 4:
            return -this.h;
        case 5:
            return this.h;
        case 6:
            return this.h * 2;
        case 7:
            return this.h;
        }
    },

};
