'use strict';

const PRE_COMPUTED_VAL_H          = 55.42562484741211;  // #pre-process_global_constant
const PRE_COMPUTED_VAL_TWO_H      = 110.85124969482422; // #pre-process_global_constant
// W_DISTANCE = Math.sqrt(3 * this.h * this.h);
const PRE_COMPUTED_VAL_W_DISTANCE = 95.99999827696978;  // #pre-process_global_constant

$_QE.prototype.HexagonGrid = function(world_manager, number_of_layers) {
    this.number_of_layers = number_of_layers;
    this.initialize_events_and_flags();
    world_manager.singleton_add(this);
};

Object.assign(
    $_QE.prototype.HexagonGrid.prototype,
    $_QE.prototype.Element.prototype,
    {
        create: function() {
            this._create_cache();

            this.single_geometry = new THREE.Geometry();
            this.materials       = [];
            this._create_tile(0, 0, 0);
            let tile             = 1;
    
            let layer;
            for (layer = 1; layer < this.number_of_layers; layer++) {
                let number_of_tiles = layer * 6;

                let gap       = layer - 1;
                let direction = 1;
                let filled    = gap;

                let offset_x  = this._get_x_offset(direction) * gap;
                let offset_y  = this._get_y_offset(direction) * gap;

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

            this.single_geometry.computeFaceNormals();
            this.single_geometry.computeVertexNormals();

            this.group = new THREE.Mesh(this.single_geometry, this.materials);
            this.group.scale.set(3, 3, 3);
            this.group.lookAt(0, 1, 0);
            this.group.updateMatrix();

            this._clear_cache();
        },

        _create_cache: function() {
            this.tile = new THREE.Geometry();

            let v0 = new THREE.Vector3(0, 0, 0);
            let v1 = new THREE.Vector3(64, 0, 0);
            let v2 = new THREE.Vector3(32, PRE_COMPUTED_VAL_H, 0);
            let v3 = new THREE.Vector3(-32, PRE_COMPUTED_VAL_H, 0);
            let v4 = new THREE.Vector3(-64, 0, 0);
            let v5 = new THREE.Vector3(-32, -PRE_COMPUTED_VAL_H, 0);
            let v6 = new THREE.Vector3(32, -PRE_COMPUTED_VAL_H, 0);

            this.tile.vertices.push(v0);
            this.tile.vertices.push(v1);
            this.tile.vertices.push(v2);
            this.tile.vertices.push(v3);
            this.tile.vertices.push(v4);
            this.tile.vertices.push(v5);
            this.tile.vertices.push(v6);

            this.tile.faces.push(new THREE.Face3(1, 2, 0));
            this.tile.faces.push(new THREE.Face3(2, 3, 0));
            this.tile.faces.push(new THREE.Face3(3, 4, 0));
            this.tile.faces.push(new THREE.Face3(4, 5, 0));
            this.tile.faces.push(new THREE.Face3(5, 6, 0));
            this.tile.faces.push(new THREE.Face3(6, 1, 0));
        },

        _clear_cache: function() {
            this.tile.dispose();
            this.tile = undefined;
        },

        _create_tile: function(x_offset, y_offset, material_offset) {
            let c = new THREE.MeshPhongMaterial({color: this._get_random_grey()});
            c.needsUpdate = true;
            this.materials.push(c);

            let m = new THREE.Matrix4();
            m.makeTranslation(x_offset, y_offset, 0);

            this.single_geometry.merge(this.tile, m, material_offset);
        },

        _get_random_grey: function() {
            //let v =  Math.floor(Math.random() * 10);
            let v = (Math.random() * 10) | 0;
            return 'rgb(' + parseInt(20 + v) + ',' + parseInt(20 + v) + ',' + parseInt(20 + v) + ')';
        },

        _get_x_offset: function(d) {
            switch(d) {
            case 1:
                return 0;
            case 2:
                return -PRE_COMPUTED_VAL_W_DISTANCE;
            case 3:
                return 0;
            case 4:
            case 5:
                return PRE_COMPUTED_VAL_W_DISTANCE;
            case 6:
                return 0;
            case 7:
                return -PRE_COMPUTED_VAL_W_DISTANCE;
            }
        },

        _get_y_offset: function(d) {
            switch(d) {
            case 1:
                return PRE_COMPUTED_VAL_TWO_H;
            case 2:
                return -PRE_COMPUTED_VAL_H;
            case 3:
                return -PRE_COMPUTED_VAL_TWO_H;
            case 4:
                return -PRE_COMPUTED_VAL_H;
            case 5:
                return PRE_COMPUTED_VAL_H;
            case 6:
                return PRE_COMPUTED_VAL_TWO_H;
            case 7:
                return PRE_COMPUTED_VAL_H;
            }
        },
    }
);

