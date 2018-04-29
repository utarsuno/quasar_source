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
            for (c = 0; c < this._objects.length; c++) {
                if (this._objects[c].is_match(args)) {
                    return this._objects[c];
                }
            }
            return this.add_cached_object(new this._cache_type(args));
        },
        add_cached_object: function(object) {
            this._objects.push(object);
            return object;
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

    function Text2DGeometryCache(args) {
        this.__init__(args);
    }
    Text2DGeometryCache.prototype = {
        __init__: function(args) {
            this._width = args[0];
            this._height = args[1];
            this._ratio  = args[2];
            this._cache = new THREE.PlaneGeometry(this._width, this._height);
            if (this._ratio !== 1) {
                this._cache.faceVertexUvs[0][0][2].x = this._ratio;
                this._cache.faceVertexUvs[0][1][1].x = this._ratio;
                this._cache.faceVertexUvs[0][1][2].x = this._ratio;
                this._cache.uvsNeedUpdate = true;
            }
        },
        is_match: function(args) {
            return this._width === args[0] && this._height === args[1] && this._ratio === args[2];
        }
    };

    function Texture2DCanvasCache(args) {
        this.__init__(args);
    }
    Texture2DCanvasCache.prototype = {
        __init__: function(args) {
            this._width = args[0];
            this._height = args[1];
            this._text = args[2];

            this._background_color = args[3];
            this._foreground_color = args[4];

            this._canvas = new CanvasTexture();
            this._canvas.set_dimensions(this.width, this.height);
            this._canvas.initialize();

            this._canvas.update(this._background_color, this._foreground_color, this.get_display_text());

            this._material = new THREE.MeshToonMaterial({
                map : this._canvas.texture, transparent: true, side: THREE.FrontSide
            });
            this._material.transparent = true;
            this._material.side = THREE.FrontSide;
            this._material.needsUpdate = true;
        },
        is_match: function(args) {
            return this._width === args[0] && this._height === args[1] && this._text === args[2];
        }
    };

    function HeapManager() {
        this.__init__();
    }
    HeapManager.prototype = {

        __init__: function() {
            this.cached_plane_geometries = new CachedObjects(PlaneGeometryCache);
            this.cached_texture_2D_geometries = new CachedObjects(Text2DGeometryCache);
            this.cached_texture_2D_canvases = new CachedObjects(Texture2DCanvasCache);
        },

        get_plane_geometry: function(width, height) {
            return this.cached_plane_geometries.get_cached_object([width, height])._cache;
        },

        get_text_2D_geometry: function(width, height, ratio) {
            return this.cached_texture_2D_geometries.get_cached_object([width, height, ratio])._cache;
        },

        get_text_2D_canvas: function(width, height, text, background_color, foreground_color) {
            return this.cached_texture_2D_canvases.get_cached_object([width, height, text, background_color, foreground_color])._canvas;
        },

        get_text_2D_material: function(width, height, text) {
            return this.cached_texture_2D_canvases.get_cached_object([width, height, text])._material;
        }

    };

    this.heap_manager = new HeapManager();
};