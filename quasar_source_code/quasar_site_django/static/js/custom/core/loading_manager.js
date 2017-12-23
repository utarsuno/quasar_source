'use strict';

function LoadingManager() {
    this.__init__();
}

LoadingManager.prototype = {

    currently_loading: null,

    __init__: function() {
        this.currently_loading = false;
    }
};