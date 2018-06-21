'use strict';

$_QE.prototype.set_heap_manager = function() {

    /*__        __        ___  __      __   __        ___  __  ___  __      __        __   ___
     /  `  /\  /  ` |__| |__  |  \    /  \ |__)    | |__  /  `  |  /__`    |__)  /\  /__` |__
     \__, /~~\ \__, |  | |___ |__/    \__/ |__) \__/ |___ \__,  |  .__/    |__) /~~\ .__/ |___ */
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

    /*__     __   __   __   ___ ___  ___     __        __        ___  __      __   __        ___  __  ___  __
     |  \ | /__` /  ` |__) |__   |  |__     /  `  /\  /  ` |__| |__  |  \    /  \ |__)    | |__  /  `  |  /__`
     |__/ | .__/ \__, |  \ |___  |  |___    \__, /~~\ \__, |  | |___ |__/    \__/ |__) \__/ |___ \__,  |  .__/ */
    // ---------------------------------------- PlaneGeometryCache ----------------------------------------
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

    // ---------------------------------------- Text2DGeometryCache ----------------------------------------
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

    // ---------------------------------------- Texture2DCanvasCache ----------------------------------------
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
            this._canvas.set_dimensions(this._width, this._height);
            this._canvas.initialize();

            this._canvas.update(this._background_color, this._foreground_color, this._text);

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

    // ---------------------------------------- SpritesheetShaderMaterialCache ----------------------------------------
    function SpritesheetShaderMaterialCache(args) {
        this.__init__(args);
    }
    SpritesheetShaderMaterialCache.prototype = {
        __init__: function(args) {
            this._icon = args[0];
            this._color = args[1];
            this._material = MANAGER_SPRITESHEET.get_icon_material(this._icon);
            this._material.uniforms['color'].value = this._color;
            this._material.needsUpdate = true;
        },
        is_match: function(args) {
            return this._icon === args[0] && this._color === args[1];
        }
    };

    // ---------------------------------------- Text3DMaterialCache ----------------------------------------
    function Text3DMaterialCache(args) {
        this.__init__(args);
    }
    Text3DMaterialCache.prototype = {
        __init__: function(args) {
            this._color = args[0];
            this._material = new THREE.MeshToonMaterial({color: this._color});
            this._material.side = THREE.FrontSide;
            this._material.needsUpdate = true;
        },
        is_match: function(args) {
            return this._color === args[0];
        }
    };

    /*     ___       __                           __   ___  __
     |__| |__   /\  |__)     |\/|  /\  |\ |  /\  / _` |__  |__)
     |  | |___ /~~\ |        |  | /~~\ | \| /~~\ \__> |___ |  \ */
    function HeapManager() {
        this.__init__();
    }
    HeapManager.prototype = {

        __init__: function() {
            this.cached_plane_geometries = new CachedObjects(PlaneGeometryCache);
            this.cached_texture_2D_geometries = new CachedObjects(Text2DGeometryCache);
            this.cached_texture_2D_canvases = new CachedObjects(Texture2DCanvasCache);
            this.cached_spritesheet_shader_materails = new CachedObjects(SpritesheetShaderMaterialCache);
            this.cached_text_3D_material = new CachedObjects(Text3DMaterialCache);
        },

        get_text_3D_material: function(color) {
            return this.cached_text_3D_material.get_cached_object([color])._material;
        },

        get_spritesheet_shader_material: function(icon, color) {
            return this.cached_spritesheet_shader_materails.get_cached_object([icon, color])._material;
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