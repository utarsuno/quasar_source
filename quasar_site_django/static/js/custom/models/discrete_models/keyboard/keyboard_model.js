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
    },

    create: function() {
        this._create_first_row();
    },

    _create_first_row: function() {
        let total_x_offset = 0;
        let x;
        for (x = 0; x < this.first_row.length; x++) {
            let k = this.first_row[x];
            this._create_key(k[0], k[1], total_x_offset);
            total_x_offset += k[1];
        }
    },
    
    _create_key: function(key, key_width, key_x_offset) {
        let k = new ButtonModel(key, this);
        k.create(this.key_depth, this.face_size, key_width, key_x_offset);
        this.object3D.add(k);
    }

};