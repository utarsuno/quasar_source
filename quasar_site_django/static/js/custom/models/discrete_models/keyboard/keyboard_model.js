'use strict';

function KeyboardModel(world) {
    this.__init__(world);
}

KeyboardModel.prototype = {

    __init__: function(world) {
        // Inherit.
        Attachmentable.call(this, world);
    },

    create: function() {
        // Temporary.
        let b = this.button_test = new ButtonModel('a', this);
        b.create(10);

        this.object3D.add(b.mesh);
    },

    _create_first_row: function() {
        let escape = new ButtonModel('escape', this);
        let k1 = new ButtonModel('1', this);
        let k2 = new ButtonModel('2', this);

        escape.create(10, 0);
        k1.create(10, 30);
        k2.create(10, 60);
    }

};