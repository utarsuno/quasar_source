'use strict';

$_QE.prototype.PlayerMenuTeleport = function(player, world, parent_row) {
    this.parent_row = parent_row;
    this.__init__(player);

    parent_row._interactive_tail._object.add_attachment(this, true, false);
    this.set_offset_horizontal(0, .5 + parent_row._interactive_tail._object.width / this.width, 0);
    this.set_offset_vertical(0, -.5);
    this.set_offset_depth(10);

    this.number_of_rows = 0;
};

Object.assign(
    $_QE.prototype.PlayerMenuTeleport.prototype,
    $_QE.prototype.PlayerMenuAbstract.prototype,
    {
        register_world: function(world) {
            let r = new $_QE.prototype.PlayerMenuRow();
            let self = this;
            r.__init__(this, world.world_icon, world.world_name, function() {
                QE.manager_world.set_current_world(world);
            }, true, true);

            this.number_of_rows++;

            if (this.number_of_rows > 1) {
                this.set_offset_vertical(0, -.5 + (((32 / 128) / 2) * (this.number_of_rows - 1)));
            }
        },

        _open: function() {
            this.set_to_visible();
            this.update_element();
        },

    }
);
