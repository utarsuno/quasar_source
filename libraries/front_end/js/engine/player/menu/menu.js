'use strict';

$_QE.prototype.PlayerMenu = function(player, world) {
    this.player = player;
    this.group  = new THREE.Group();
    this.initialize_floating_element_data();
    this.initialize_interactive_linked_list();
    // Temporary.
    this.set_dimensions(512, 128);

    world.create_and_add_element_to_root(this);

    this.row_create     = new $_QE.prototype.PlayerMenuRowCreate(this);
    this.row_teleport   = new $_QE.prototype.PlayerMenuRowTeleport(this);
    this.row_fullscreen = new $_QE.prototype.PlayerMenuRowFullScreen(this);

    // TODO: fix player blink position

};

Object.assign(
    $_QE.prototype.PlayerMenu.prototype,
    $_QE.prototype.PlayerMenuAbstract.prototype,
    {
        is_open : false,

        _open: function() {
            this.player.set_object_in_front_of(this, 650);
        },
    }
);

