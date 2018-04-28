'use strict';

function HeapManager() {
    this.__init__();
}

HeapManager.prototype = {

    __init__: function() {
        // Format [width, height, cached_geometry]
        this._cached_plane_geometries   = [];
        // Format [width, height, ratio, cached_geometry]
        this._cached_text_2D_geometries = [];
    },

    get_text_2D_geometry: function(width, height, ratio) {
        let c;
        let match = null;
        l('get text 2D geo!');
        for (c = 0; c < this._cached_text_2D_geometries.length; c++) {
            if (this._cached_text_2D_geometries[c][0] === width && this._cached_text_2D_geometries[c][1] === height && this._cached_text_2D_geometries[c][2] === ratio) {
                match = this._cached_text_2D_geometries[c][3];
                l('text2D geo match found!');
                break;
            }
        }
        if (match === null) {
            let geometry;
            if (is_defined(ratio)) {
                geometry = new THREE.PlaneGeometry(width, height);

                geometry.faceVertexUvs[0][0][2].x = ratio;
                geometry.faceVertexUvs[0][1][1].x = ratio;
                geometry.faceVertexUvs[0][1][2].x = ratio;

                geometry.uvsNeedUpdate = true;
            } else {
                geometry = new THREE.PlaneGeometry(width, height);
            }
            this._cached_text_2D_geometries.push([width, height, ratio, geometry]);
            match = this._cached_text_2D_geometries[this._cached_text_2D_geometries.length - 1][3];
        }
        return match;
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