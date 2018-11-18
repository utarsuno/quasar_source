'use strict';

$_QE.prototype.PlayerMenuRowCreate = function(menu) {
    this.__init__(menu, ASSET_ICON_WRENCH, 'create', this._action_create.bind(this));

    let self = this;
    this.button.set_event(ELEMENT_EVENT_ON_LOOK_AT, function() {
        self.row.parent_wall.on_main_menu_button_look_at(self.button);
    });
};

Object.assign(
    $_QE.prototype.PlayerMenuRowCreate.prototype,
    $_QE.prototype.PlayerMenuRow.prototype,
    {

        _action_create: function() {
            l('Todo: action create');
        },

    }
);
