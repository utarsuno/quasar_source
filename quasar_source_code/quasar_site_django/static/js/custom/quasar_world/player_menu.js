'use strict';

function PlayerMenu() {
    this.__init__();
}

PlayerMenu.prototype = {

    __init__: function() {

    },

    set_to_invisible: function() {

    },

    set_to_visible: function() {

    },

    update: function(delta) {
        l(delta);
    }

};


/*
this.player_menu = new FloatingWall(100, 50, new THREE.Vector3(-5000, -5000, -5000), new THREE.Vector3(0, 0, 0), this, false);
this.player_menu.add_floating_2d_text(0, 1, 'Create Entity Wall', TYPE_BUTTON, 0);
this.player_menu.add_floating_2d_text(0, 1, 'Create Image', TYPE_BUTTON, 1);
this.player_menu.add_floating_2d_text(0, 1, 'Save', TYPE_BUTTON, 2);
this.player_menu.set_to_invisible();
 */