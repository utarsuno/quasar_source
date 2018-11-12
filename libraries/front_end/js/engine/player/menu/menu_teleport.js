'use strict';

$_QE.prototype.PlayerMenuTeleport = function(player, world, parent_row) {
    this.parent_row = parent_row;

    this.player = player;
    this.group  = new THREE.Group();
    this.initialize_floating_element_data();
    this.initialize_interactive_linked_list();
    // Temporary.
    this.set_dimensions(512, 128);

    world.create_and_add_element_to_root(this);
    //parent_row.

    this.row_test0 = new $_QE.prototype.PlayerMenuRowFullScreen(this);
    this.row_test1 = new $_QE.prototype.PlayerMenuRowFullScreen(this);
};

Object.assign(
    $_QE.prototype.PlayerMenuTeleport.prototype,
    $_QE.prototype.PlayerMenuAbstract.prototype,
    {
        _open: function() {
            //l(this.parent_row._interactive_tail._object.get_object().position);

            //get_world_position_offset_horizontal

            //l(this.parent_row);

            let width = this.parent_row._interactive_tail._object.width;

            let p = this.parent_row._interactive_tail._object.get_world_position_offset_horizontal(-width/2);

            this.set_position(p.x, p.y, p.z);
            this.update_element();

            //let pp = this.player.get_position();
            let pp = this.parent_row._interactive_tail._object.get_normal();
            this.look_at(
                pp.x + p.x, pp.y + p.y, pp.z + p.z
            );

            this.update_element();


            //this.player.set_object_in_front_of(this, 300);
        },
    }
);
