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
            ['space', this.face_size * 6],
            ['alt', this.face_size],
            [' ', this.face_size],
            ['alt', this.face_size],
            ['ctrl', this.face_size],
        ];
    },

    create: function() {
        let row_height = this.key_depth * 2 + this.face_size;
        this._create_row(this.first_row, 0);
        this._create_row(this.second_row, -row_height);
        this._create_row(this.third_row, -row_height * 2);
        this._create_row(this.fourth_row, -row_height * 3);
        this._create_row(this.fifth_row, -row_height * 3);
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

    _create_key: function(key, key_width, key_x_offset, y_offset, tooltip) {
        let k = new ButtonModel(key, this);
        k.create(this.key_depth, this.face_size, key_width, key_x_offset, y_offset);

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

        this.object3D.add(k.mesh);
        this.object3D.add(label.object3D);
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

        this.object3D.add(line);
        this.object3D.add(label.object3D);
    }

};
