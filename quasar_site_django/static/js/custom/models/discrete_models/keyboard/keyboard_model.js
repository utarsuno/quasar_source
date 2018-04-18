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

        // First row values.
        this.first_row = [
            ['esc', this.face_size],
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

        // Second row values.
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

        // Third row values.
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

        // Fourth row values.
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
    },

    create: function() {
        let row_height = this.key_depth * 2 + this.face_size;
        this._create_row(this.first_row, 0);
        this._create_row(this.second_row, -row_height);
        this._create_row(this.third_row, -row_height * 2);
        this._create_row(this.fourth_row, -row_height * 3);
    },

    _create_row: function(row, y_offset) {
        let total_x_offset = 0;
        let x;
        for (x = 0; x < row.length; x++) {
            let k = row[x];
            this._create_key(k[0], k[1], total_x_offset, y_offset);
            total_x_offset += k[1] + this.key_depth * 2;
        }
    },

    _create_key: function(key, key_width, key_x_offset, y_offset) {
        let k = new ButtonModel(key, this);
        k.create(this.key_depth, this.face_size, key_width, key_x_offset, y_offset);

        let p = k.mesh.position;

        let label = new FloatingText2D(this.world, this.face_size * .8, key);
        label.set_position_xyz(p.mesh.x, p.mesh.y, p.mesh.z);

        this.object3D.add(k.mesh);
        this.object3D.add(label);
    }

};
