'use strict';

ManagerManager.prototype.set_heap_manager = function() {

    function CachedObjects(cache_type) {
        this.__init__(cache_type);
    }
    CachedObjects.prototype = {
        __init__: function(cache_type) {
            this._cache_type = cache_type;
            this._objects = [];
        },
        get_cached_object: function(args) {
            let c;
            let match = null;
            for (c = 0; c < this._objects.length; c++) {
                if (this._objects[c].is_match(args)) {
                    return this._objects[c];
                }
            }
            if (match === null) {
                match = this.add_cached_object(new this._cache_type(args));
            }
            return match;
        },
        add_cached_object: function(object) {
            this._objects.push(object);
            return object._cache;
        }
    };

    function PlaneGeometryCache(args) {
        this.__init__(args);
    }
    PlaneGeometryCache.prototype = {
        __init__: function(args) {
            this._width = args[0];
            this._height = args[1];
            this._cache = new THREE.PlaneGeometry(this._width, this._height);
        },
        is_match: function(args) {
            return this._width === args[0] && this._height === args[1];
        }
    };

    function HeapManager() {
        this.__init__();
    }

    HeapManager.prototype = {

        __init__: function() {
            // Format [width, height, cached_geometry]
            this._cached_plane_geometries   = [];
            // Format [width, height, ratio, cached_geometry]
            this._cached_text_2D_geometries = [];
            // Format [width, height, text, cached_canvas, cached_material]
            this._cached_text_2D_textures   = [];


            this.cached_plane_geometries = new CachedObjects(PlaneGeometryCache);
        },

        get_plane_geometry: function(width, height) {
            return this.cached_plane_geometries.get_cached_object([width, height]);
        },

        get_icon_geometryOLD: function(width, height) {
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
        },

        get_text_2D_texture: function(width, height, text) {

        },

        get_text_2D_material: function(width, height, text) {
            let c;
            let match = null;
            for (c = 0; c < this._cached_text_2D_geometries.length; c++) {
                if (this._cached_text_2D_textures[c][0] === width && this._cached_text_2D_textures[c][1] === height && this._cached_text_2D_textures[c][2] === text) {
                    match = this._cached_text_2D_textures[c][4];
                    break;
                }
            }
            if (match === null) {
                let material = new THREE.MeshToonMaterial({
                    map : this.canvas.texture, transparent: true, side: THREE.FrontSide
                });
                material.transparent = true;
                material.side = THREE.FrontSide;
                this._cached_text_2D_textures.push([width, height, text, ]);
            }
        },

        get_text_2D_geometry: function(width, height, ratio) {
            let c;
            let match = null;
            for (c = 0; c < this._cached_text_2D_geometries.length; c++) {
                if (this._cached_text_2D_geometries[c][0] === width && this._cached_text_2D_geometries[c][1] === height && this._cached_text_2D_geometries[c][2] === ratio) {
                    match = this._cached_text_2D_geometries[c][3];
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
        }

    };

    this.heap_manager = new HeapManager();
};