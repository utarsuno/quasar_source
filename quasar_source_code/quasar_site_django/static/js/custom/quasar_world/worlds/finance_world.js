'use strict';

function FinanceWorld() {
    this.__init__();
}

FinanceWorld.prototype = {

    __init__: function () {
        World.call(this, 'FinanceWorld');
    },

    create_world: function() {
    }
};