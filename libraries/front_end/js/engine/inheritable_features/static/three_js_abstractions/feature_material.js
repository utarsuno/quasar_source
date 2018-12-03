'use strict';

$_QE.prototype.FeatureMaterial = function(){};

Object.assign($_QE.prototype.FeatureMaterial.prototype, {

    set_opacity: function(v) {
        if (this.material_type == FEATURE_MATERIAL_TYPE_ICON) {
            this.shader_material.set_alpha(v);
        } else {
            this.material.opacity = v;
        }
        this.material.needsUpdate = true;
    },

    set_material_type: function(use_cache, type) {
        this.flag_set(EFLAG_IS_CACHEABLE_MATERIAL, use_cache);
        this.material_type = type;
    },

    recycle_material: function() {
        if (this.flag_is_off(EFLAG_IS_CACHEABLE_MATERIAL)) {
            if (this.material != null) {
                if (this.material.map != null) {
                    this.material.map.dispose();
                    this.material.map = undefined;
                }
                this.material.dispose();
                this.material = undefined;
            }
        } else {
            l('WARNING: recycle_material called on cacheable material.');
            l(this);
        }
        this.material = null;
    },

    _create_material_cached: function() {
        switch(this.material_type) {
        case FEATURE_MATERIAL_TYPE_TEXT_3D:
            this.material = QE.manager_heap.get_text_3D_material(this.current_foreground_color);
            break;
        case FEATURE_MATERIAL_TYPE_ICON:
            this.shader_material = QE.manager_assets.get_icon_shader(this.icon_type);
            this.material        = this.shader_material.shader_material;
            break;
        }
    },

    _create_material_texture_map: function(material_class) {
        this.material = new material_class({
            map : this.texture, transparent: true, side: THREE.DoubleSide
        });
        if (this.current_background_color != null && this.current_background_color == QE.COLOR_RGBA_TRANSPARENT) {
            this.material.alphaTest = 0.5;
        }
    },

    _create_material_normal: function(material_class, transparent=false) {
        let args = {side: THREE.DoubleSide, color: this.current_foreground_color};
        if (transparent) {
            args.transparent = true;
        }
        this.material = new material_class(args);
    },

    _create_material_new: function() {
        switch(this.material_type) {
        case FEATURE_MATERIAL_CANVAS_BASIC:
            this._create_material_texture_map(THREE.MeshBasicMaterial);
            break;
        case FEATURE_MATERIAL_CANVAS_FANCY:
            this._create_material_texture_map(THREE.MeshLambertMaterial);
            break;
        case FEATURE_MATERIAL_CANVAS_SHINY:
            this._create_material_texture_map(THREE.MeshToonMaterial);
            break;
        case FEATURE_MATERIAL_COLOR_FANCY:
            this._create_material_normal(THREE.MeshToonMaterial);
            break;
        case FEATURE_MATERIAL_COLOR_TRANSPARENT:
            this._create_material_normal(THREE.MeshToonMaterial, true);
            break;
        }
    },

    create_material: function() {
        this.flag_is_on(EFLAG_IS_CACHEABLE_MATERIAL) ? this._create_material_cached() : this._create_material_new();
        if (this.opacity != null) {
            this.set_opacity(this.opacity);
        }

        if (this.material_type == FEATURE_MATERIAL_TYPE_ICON) {
            this.shader_material.set_icon(this.icon_type);
        }
    },

});
