'use strict';

$_QE.prototype.PlayerMenuCreate = function(player, world, parent_row) {
    this.parent_row = parent_row;
    this.__init__(player);

    parent_row._interactive_tail._object.add_attachment(this, true, false);
    this.set_offset_horizontal(0, .5 + parent_row._interactive_tail._object.width / this.width, 0);
    this.set_offset_vertical(0, -.5);
    this.set_offset_depth(10);

    this.number_of_rows = 0;

    let row_todo_list = new $_QE.prototype.PlayerMenuRow();
    let self = this;
    row_todo_list.__init__(this, ASSET_ICON_CALENDAR, 'TODO List', function() {
        l('TODO: Create a todo list lol');

        let pp = player.get_position();
        let pn = player.get_normal();

        // F L O A T I N G - T E R M I N A L
        let ftl = new $_QE.prototype.FloatingTodoList({
            ARG_NUMBER_OF_ROWS        : 32,
            ARG_FONT                  : QE.FONT_ARIAL_32,
            ARG_TEXT                  : 'Floating TODO List',
            ARG_CREATE_AND_ADD_TO_ROOT: world,
            ARG_SET_POSITION_CENTER   : [pp.x + pn.x * 1000, pp.y, pp.z + pn.z * 1000, pp.x, pp.y, pp.z, true]
        });

    }, true, true);
    this.number_of_rows++;
    this.set_offset_vertical(0, -.5 + (((32 / 128) / 2) * (this.number_of_rows - 1)));
};

Object.assign(
    $_QE.prototype.PlayerMenuCreate.prototype,
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

        //_open: function() {},

    }
);
