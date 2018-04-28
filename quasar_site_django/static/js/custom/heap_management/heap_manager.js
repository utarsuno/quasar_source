'use strict';

function HeapManager() {
    this.__init__();
}

HeapManager.prototype = {

    __init__: function() {
        // Format [width, height, cached_geometry]
        this._cached_plane_geometries = [];
    },

    get_icon_geometry: function(width, height) {
        let c;
        let match = null;
        for (c = 0; c < this._cached_plane_geometries.length; c++) {
            if (this._cached_plane_geometries[c][0] === width && this._cached_plane_geometries[c][1] === height) {
                match = this._cached_plane_geometries[c][2];
                break;
            }
        }
        if (match === null) {
            this._cached_plane_geometries.push([width, height, new THREE.PlaneGeometry(width, height)]);
            match = this._cached_plane_geometries[this._cached_plane_geometries.length - 1][2];
        }
        return match;
    }

};