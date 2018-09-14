'use strict';

$_QE.prototype.FeatureMaterial = function(cacheable, type) {

    this.material_type         = type;
    this.is_material_cacheable = cacheable;

    this.recycle_material = function() {
        if (!this.is_material_cacheable) {
            if (this.material != null) {
                if (this.material.map != null) {
                    this.material.map.dispose();
                    this.material.map = undefined;
                }
                this.material.dispose();
                this.material = undefined;
            }
        }
    };

    this._create_material_cached = function() {
        switch(this.material_type) {
        case FEATURE_MATERIAL_TYPE_TEXT_3D:
            this.material = QE.manager_heap.get_text_3D_material(this.current_foreground_color);
            break;
        case FEATURE_MATERIAL_TYPE_ICON:
            this.material = QE.manager_icons.get_icon_material(this.icon_type);
            break;
        }
    };

    this._create_material_new = function() {
        switch(this.material_type) {
        case FEATURE_MATERIAL_CANVAS_BASIC:
            this.material = new THREE.MeshBasicMaterial({
                map : this.texture, transparent: true, side: THREE.FrontSide
            //    map : this.texture, transparent: false, side: THREE.DoubleSide
            });
            break;
        case FEATURE_MATERIAL_CANVAS_FANCY:
            this.material = new THREE.MeshLambertMaterial({
                map : this.texture, transparent: true, side: THREE.FrontSide
            //    map : this.texture, transparent: false, side: THREE.DoubleSide
            });
            break;
        case FEATURE_MATERIAL_CANVAS_SHINY:
            this.material = new THREE.MeshToonMaterial({
                map : this.texture, transparent: true, side: THREE.FrontSide
            //    map : this.texture, transparent: false, side: THREE.DoubleSide
            });
            break;
        }
    };

    this.create_material = function() {
        this.is_material_cacheable ? this._create_material_cached() : this._create_material_new();
    };

};