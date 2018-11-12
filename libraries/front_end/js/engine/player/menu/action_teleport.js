'use strict';

$_QE.prototype.PlayerMenuRowTeleport = function(menu) {
    this.__init__(menu, ASSET_ICON_TELEPORT, 'teleport', this._action_teleport.bind(this));

    //this.menu = $_QE.prototype.PlayerMenuTeleport(menu.player, menu.world);

    let self = this;
    this.button.set_event(ELEMENT_EVENT_ON_LOOK_AT, function() {
        l('Show teleport wall!');
        if (self.menu == null) {
            l('creating menu!');
            self.menu = new $_QE.prototype.PlayerMenuTeleport(menu.player, menu.world, self.row);
        }
        self.menu.open();
    });

    this.button.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, function() {
        l('Hide teleport wall!');
    });
};

Object.assign(
    $_QE.prototype.PlayerMenuRowTeleport.prototype,
    $_QE.prototype.PlayerMenuRow.prototype,
    {

        _action_teleport: function() {
            l('Todo: action teleport');
        },

    }
);
