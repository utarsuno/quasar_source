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
    }

};