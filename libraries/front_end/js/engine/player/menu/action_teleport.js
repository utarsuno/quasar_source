'use strict';

$_QE.prototype.PlayerMenuRowTeleport = function(menu) {
    this.__init__(menu, ASSET_ICON_TELEPORT, 'teleport', this._action_teleport.bind(this));

    this._register_list = [];

    let self = this;
    this.button.set_event(ELEMENT_EVENT_ON_LOOK_AT, function() {
        if (self.menu == null) {
            self.menu = new $_QE.prototype.PlayerMenuTeleport(menu.player, menu.world, self.row);

            if (self._register_list.length > 0) {
                let r;
                for (r = 0; r < self._register_list.length; r++) {
                    self.menu.register_world(self._register_list[r]);
                }
            }
            self._register_list = undefined;
        }
        self.menu.open();

        self.row.parent_wall.on_main_menu_button_look_at(self.button);
    });

    this.button.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, function() {
        //l('Hide teleport wall!');
    });
};

Object.assign(
    $_QE.prototype.PlayerMenuRowTeleport.prototype,
    $_QE.prototype.PlayerMenuRow.prototype,
    {
        register_world: function(world) {
            if (this.menu == null) {
                this._register_list.push(world);
            } else {
                this.menu.register_world(world);
            }
        },

        _action_teleport: function() {
            l('Todo: action teleport');
        },

    }
);
