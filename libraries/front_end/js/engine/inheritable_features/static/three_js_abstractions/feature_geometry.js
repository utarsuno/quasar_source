'use strict';

$_QE.prototype.FeatureGeometry = function(){};

Object.assign($_QE.prototype.FeatureGeometry.prototype, {

    set_geometry_type: function(use_cache, type) {
        this.flag_set(EFLAG_IS_CACHEABLE_GEOMETRY, use_cache);
        this.geometry_type = type;
    },

    recycle_geometry: function() {
        if (this.flag_is_off(EFLAG_IS_CACHEABLE_GEOMETRY)) {
            if (this.geometry != null) {
                this.geometry.dispose();
                this.geometry = undefined;
            }
        } else {
            l('Warning! recycle_geometry called on a caeable geometry.');
            l(this);
        }
    },

    _create_geometry_cached: function() {
        switch(this.geometry_type) {
        case FEATURE_GEOMETRY_TYPE_PLANE:
            this.geometry = QE.manager_heap.get_plane_geometry(this.width, this.height);
            break;
        case FEATURE_GEOMETRY_TYPE_TEXT_3D:
            l('TODO: SUPPORT CACHE AND 3D TEXT!');
            break;
        }
    },

    _create_geometry_new: function() {
        switch(this.geometry_type) {
        case FEATURE_GEOMETRY_TYPE_PLANE:
            this.geometry = new THREE.PlaneGeometry(this.width, this.height);
            break;
        case FEATURE_GEOMETRY_TYPE_TEXT_3D:
            this.geometry = new THREE.TextGeometry(this.text, {
                size: this.text_size,
                height: 2,
                curveSegments: 2,
                font: $_QE.prototype.GLOBAL_FONT
            });
            break;
        }
    },

    create_geometry: function() {
        this.flag_is_on(EFLAG_IS_CACHEABLE_GEOMETRY) ? this._create_geometry_cached() : this._create_geometry_new();
    },
});
