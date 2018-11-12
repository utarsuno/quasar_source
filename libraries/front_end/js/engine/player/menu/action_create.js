'use strict';

$_QE.prototype.PlayerMenuRowCreate = function(menu) {
    this.__init__(menu, ASSET_ICON_WRENCH, 'create', this._action_create.bind(this));


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
