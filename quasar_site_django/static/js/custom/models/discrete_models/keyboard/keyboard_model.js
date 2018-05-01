'use strict';

function KeyboardModel(world) {
    this.__init__(world);
}

KeyboardModel.prototype = {

    __init__: function(world) {
        // Inherit.
        Attachmentable.call(this, world);
        this.key_depth = 10;
        this.face_size = 30;

        this.size_add_half = this.face_size * 1.5;
        this.size_double   = this.face_size * 2;
    },

    create: function() {
        this._create_cache();

        this.single_geometry = new THREE.Geometry();

        let row_height = this.key_depth * 2 + this.face_size;
        let y1 = -row_height;
        let y2 = -row_height * 2;
        let y3 = -row_height * 3;
        let y4 = -row_height * 4;

        // First row.
        this._create_key('esc', this.face_size, 0, 0, [-200, 100, 'Press to release mouse control.']);
        this._create_key('1', this.face_size, this.face_size + this.key_depth * 2, 0);
        this._create_key('2', this.face_size, this.face_size * 2 + this.key_depth * 4, 0);
        this._create_key('3', this.face_size, this.face_size * 3 + this.key_depth * 6, 0);
        this._create_key('4', this.face_size, this.face_size * 4 + this.key_depth * 8, 0);
        this._create_key('5', this.face_size, this.face_size * 5 + this.key_depth * 10, 0);
        this._create_key('6', this.face_size, this.face_size * 6 + this.key_depth * 12, 0);
        this._create_key('7', this.face_size, this.face_size * 7 + this.key_depth * 14, 0);
        this._create_key('8', this.face_size, this.face_size * 8 + this.key_depth * 16, 0);
        this._create_key('9', this.face_size, this.face_size * 9 + this.key_depth * 18, 0);
        this._create_key('0', this.face_size, this.face_size * 10 + this.key_depth * 20, 0);
        this._create_key('-', this.face_size, this.face_size * 11 + this.key_depth * 22, 0);
        this._create_key('+', this.face_size, this.face_size * 12 + this.key_depth * 24, 0);
        this._create_key('backspace', this.face_size * 2, this.face_size * 13  + this.key_depth * 26, 0);
        // Second row.
        this._create_key('tab', this.face_size * 1.5, 0, y1);
        this._create_key('q', this.face_size, this.face_size * 1.5 + this.key_depth * 2, y1);
        this._create_key('w', this.face_size, this.face_size * 2.5 + this.key_depth * 4, y1);
        this._create_key('e', this.face_size, this.face_size * 3.5 + this.key_depth * 6, y1);
        this._create_key('r', this.face_size, this.face_size * 4.5 + this.key_depth * 8, y1);
        this._create_key('t', this.face_size, this.face_size * 5.5 + this.key_depth * 10, y1);
        this._create_key('y', this.face_size, this.face_size * 6.5 + this.key_depth * 12, y1);
        this._create_key('u', this.face_size, this.face_size * 7.5 + this.key_depth * 14, y1);
        this._create_key('i', this.face_size, this.face_size * 8.5 + this.key_depth * 16, y1);
        this._create_key('o', this.face_size, this.face_size * 9.5 + this.key_depth * 18, y1);
        this._create_key('p', this.face_size, this.face_size * 10.5 + this.key_depth * 20, y1);
        this._create_key('[', this.face_size, this.face_size * 11.5 + this.key_depth * 22, y1);
        this._create_key(']', this.face_size, this.face_size * 12.5 + this.key_depth * 24, y1);
        this._create_key('\\', this.face_size * 1.5, this.face_size * 13.5 + this.key_depth * 26, y1);
        // Third row.
        this._create_key('caps', this.face_size * 1.6, 0, y2);
        this._create_key('a', this.face_size, this.face_size * 1.6 + this.key_depth * 2, y2);
        this._create_key('s', this.face_size, this.face_size * 2.6 + this.key_depth * 4, y2);
        this._create_key('d', this.face_size, this.face_size * 3.6 + this.key_depth * 6, y2);
        this._create_key('f', this.face_size, this.face_size * 4.6 + this.key_depth * 8, y2);
        this._create_key('g', this.face_size, this.face_size * 5.6 + this.key_depth * 10, y2);
        this._create_key('h', this.face_size, this.face_size * 6.6 + this.key_depth * 12, y2);
        this._create_key('j', this.face_size, this.face_size * 7.6 + this.key_depth * 14, y2);
        this._create_key('k', this.face_size, this.face_size * 8.6 + this.key_depth * 16, y2);
        this._create_key('l', this.face_size, this.face_size * 9.6 + this.key_depth * 18, y2);
        this._create_key(';', this.face_size, this.face_size * 10.6 + this.key_depth * 20, y2);
        this._create_key('\'', this.face_size, this.face_size * 11.6 + this.key_depth * 22, y2);
        this._create_key('enter', this.face_size * 2, this.face_size * 12.6 + this.key_depth * 24, y2);
        // Fourth row.
        this._create_key('shift', this.face_size * 2, 0, y3);
        this._create_key('z', this.face_size, this.face_size * 2 + this.key_depth * 2, y3);
        this._create_key('x', this.face_size, this.face_size * 3 + this.key_depth * 4, y3);
        this._create_key('c', this.face_size, this.face_size * 4 + this.key_depth * 6, y3);
        this._create_key('v', this.face_size, this.face_size * 5 + this.key_depth * 8, y3);
        this._create_key('b', this.face_size, this.face_size * 6 + this.key_depth * 10, y3);
        this._create_key('n', this.face_size, this.face_size * 7 + this.key_depth * 12, y3);
        this._create_key('m', this.face_size, this.face_size * 8 + this.key_depth * 14, y3);
        this._create_key(',', this.face_size, this.face_size * 9 + this.key_depth * 16, y3);
        this._create_key('.', this.face_size, this.face_size * 10 + this.key_depth * 18, y3);
        this._create_key('/', this.face_size, this.face_size * 11 + this.key_depth * 20, y3);
        this._create_key('shift', this.face_size * 2, this.face_size * 12 + this.key_depth * 22, y3);
        // Fifth row.
        this._create_key('ctrl', this.face_size, 0, y4);
        this._create_key(' ', this.face_size, this.face_size + this.key_depth * 2, y4);
        this._create_key('alt', this.face_size, this.face_size * 2 + this.key_depth * 4, y4);
        this._create_key('space', this.face_size * 9, this.face_size * 3 + this.key_depth * 6, y4);
        this._create_key('alt', this.face_size, this.face_size * 12 + this.key_depth * 8, y4);
        this._create_key(' ', this.face_size, this.face_size * 13 + this.key_depth * 10, y4);
        this._create_key('ctrl', this.face_size, this.face_size * 14 + this.key_depth * 12, y4);

        this.single_mesh = new THREE.Mesh(this.single_geometry, new THREE.MeshNormalMaterial());
        this.object3D.add(this.single_mesh);
        this._clear_cache();
    },

    _create_cache: function() {
        // Standard key sizes cache.
        this.cached_key_geometry           = this._get_key_geometry(this.face_size);
        this.cached_key_geometry_plus_half = this._get_key_geometry(this.size_add_half);
        this.cached_key_geometry_double    = this._get_key_geometry(this.size_double);
    },

    _clear_cache: function() {
        this.cached_key_geometry.dispose();
        this.cached_key_geometry_plus_half.dispose();
        this.cached_key_geometry_double.dispose();
        this.cached_key_geometry = undefined;
        this.cached_key_geometry_plus_half = undefined;
        this.cached_key_geometry_double = undefined;
        //this.first_row = undefined;
        //this.second_row = undefined;
        //this.third_row = undefined;
        //this.fourth_row = undefined;
        //this.fifth_row = undefined;
    },

    _get_key_geometry: function(key_width) {
        let geometry = new THREE.Geometry();

        // Face.
        let v0 = new THREE.Vector3(this.key_depth, this.key_depth, 0);
        let v1 = new THREE.Vector3(this.key_depth + key_width, this.key_depth, 0);
        let v2 = new THREE.Vector3(this.key_depth + key_width, this.key_depth + this.face_size, 0);
        let v3 = new THREE.Vector3(this.key_depth, this.key_depth + this.face_size, 0);
        // Top left.
        let v4 = new THREE.Vector3(0, this.key_depth * 2 + this.face_size, -this.key_depth);
        // Top right.
        let v5 = new THREE.Vector3(this.key_depth * 2 + key_width, this.key_depth * 2 + this.face_size, -this.key_depth);
        // Bottom right.
        let v6 = new THREE.Vector3(this.key_depth * 2 + key_width, 0, -this.key_depth);
        // Bottom left.
        let v7 = new THREE.Vector3(0, 0, -this.key_depth);

        // Face.
        geometry.vertices.push(v0);
        geometry.vertices.push(v1);
        geometry.vertices.push(v2);
        geometry.vertices.push(v3);
        // Top left.
        geometry.vertices.push(v4);
        // Top right.
        geometry.vertices.push(v5);
        // Right edge.
        geometry.vertices.push(v6);
        // Bottom left.
        geometry.vertices.push(v7);

        // Face.
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(2, 3, 0));
        // Top edge.
        geometry.faces.push(new THREE.Face3(3, 5, 4));
        geometry.faces.push(new THREE.Face3(3, 2, 5));
        // Right edge.
        geometry.faces.push(new THREE.Face3(2, 6, 5));
        geometry.faces.push(new THREE.Face3(2, 1, 6));
        // Bottom edge.
        geometry.faces.push(new THREE.Face3(7, 6, 1));
        geometry.faces.push(new THREE.Face3(7, 1, 0));
        // Left edge.
        geometry.faces.push(new THREE.Face3(7, 0, 3));
        geometry.faces.push(new THREE.Face3(3, 4, 7));

        geometry.computeFaceNormals();
        return geometry;
    },

    _create_key: function(key, key_width, key_x_offset, y_offset, tooltip) {
        let key_geometry;
        switch(key_width) {
        case this.face_size:
            key_geometry = this.cached_key_geometry;
            break;
        case this.size_add_half:
            key_geometry = this.cached_key_geometry_plus_half;
            break;
        case this.size_double:
            key_geometry = this.cached_key_geometry_double;
            break;
        default:
            key_geometry = this._get_key_geometry(key_width);
            break;
        }

        if (key_width === this.face_size) {
            key_geometry = this.cached_key_geometry;
        } else {
            key_geometry = this._get_key_geometry(key_width);
        }

        let m = new THREE.Matrix4();
        m.makeTranslation(key_x_offset, y_offset, 0);

        this.single_geometry.merge(key_geometry, m);

        if (key_width !== this.face_size && key_width !== this.size_add_half && key_width !== this.size_double) {
            key_geometry.dispose();
        }

        // TODO : Create the needed tooltip.
        /*
        let p = k.mesh.position;

        let label = new FloatingText2D(this.world, this.face_size * .8, key, null, this.face_size);
        label.set_position(p.x + this.key_depth + this.face_size / 2, p.y + this.key_depth + this.face_size / 3, p.z + 5);

        if (is_defined(tooltip)) {
            let e = new THREE.Vector3(p.x, p.y, p.z);
            e.x += tooltip[0];
            e.y += tooltip[1];

            let p2 = new THREE.Vector3(p.x + this.key_depth + this.face_size / 2, p.y + this.key_depth + this.face_size / 3, p.z + 5);

            this._create_tooltip(e, p2, tooltip[2]);
        }
        */
    },

    _create_tooltip: function(position_start, position_end, text) {
        let material = new THREE.LineBasicMaterial({color: 0x0000ff});
        let geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(position_start.x, position_start.y, position_start.z),
            new THREE.Vector3(position_end.x, position_end.y, position_end.z)
        );

        let line = new THREE.Line(geometry, material);

        let label = new FloatingText2D(this.world, 16, text);
        label.set_position(position_start.x, position_start.y, position_start.z);

        this.object3D.add(line);
        this.object3D.add(label.object3D);
    }

};

// FOR REFERENCE :
/*
        this.first_row = [
            ['esc', this.face_size, [-200, 100, 'Press to release mouse control.']],
            ['1', this.face_size],
            ['2', this.face_size],
            ['3', this.face_size],
            ['4', this.face_size],
            ['5', this.face_size],
            ['6', this.face_size],
            ['7', this.face_size],
            ['8', this.face_size],
            ['9', this.face_size],
            ['0', this.face_size],
            ['-', this.face_size],
            ['+', this.face_size],
            ['backsapce', this.face_size * 2],
        ];
        this.second_row = [
            ['tab', this.face_size * 1.5],
            ['q', this.face_size],
            ['w', this.face_size],
            ['e', this.face_size],
            ['r', this.face_size],
            ['t', this.face_size],
            ['y', this.face_size],
            ['u', this.face_size],
            ['i', this.face_size],
            ['o', this.face_size],
            ['p', this.face_size],
            ['p', this.face_size],
            ['[', this.face_size],
            [']', this.face_size],
            ['\\', this.face_size * 1.5],
        ];
        this.third_row = [
            ['caps', this.face_size * 1.6],
            ['a', this.face_size],
            ['s', this.face_size],
            ['d', this.face_size],
            ['f', this.face_size],
            ['g', this.face_size],
            ['h', this.face_size],
            ['j', this.face_size],
            ['k', this.face_size],
            ['l', this.face_size],
            [';', this.face_size],
            ['\'', this.face_size],
            ['enter', this.face_size * 2]
        ];
        this.fourth_row = [
            ['shift', this.face_size * 2],
            ['z', this.face_size],
            ['x', this.face_size],
            ['c', this.face_size],
            ['v', this.face_size],
            ['b', this.face_size],
            ['n', this.face_size],
            ['m', this.face_size],
            [',', this.face_size],
            ['.', this.face_size],
            ['/', this.face_size],
            ['shift', this.face_size * 2]
        ];
        this.fifth_row = [
            ['ctrl', this.face_size],
            [' ', this.face_size],
            ['alt', this.face_size],
            ['space', this.face_size * 9],
            ['alt', this.face_size],
            [' ', this.face_size],
            ['alt', this.face_size],
            ['ctrl', this.face_size],
        ];

    createOLD: function() {
        this._create_cache();

        let row_height = this.key_depth * 2 + this.face_size;
        this._create_row(this.first_row, 0);
        this._create_row(this.second_row, -row_height);
        this._create_row(this.third_row, -row_height * 2);
        this._create_row(this.fourth_row, -row_height * 3);
        this._create_row(this.fifth_row, -row_height * 4);

        //this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshNormalMaterial());
        //this.mesh = new THREE.Mesh(this.geometry);

        this.single_mesh = new THREE.Mesh(this.single_geometry, new THREE.MeshNormalMaterial());
        this.object3D.add(this.single_mesh);

        this._clear_cache();
    },

    _create_row: function(row, y_offset) {
        let total_x_offset = 0;
        let x;
        for (x = 0; x < row.length; x++) {
            let k = row[x];
            this._create_key(k[0], k[1], total_x_offset, y_offset, k[2]);
            total_x_offset += k[1] + this.key_depth * 2;
        }
    },
 */
