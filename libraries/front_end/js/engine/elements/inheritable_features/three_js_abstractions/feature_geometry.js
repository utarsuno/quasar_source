'use strict';

$_QE.prototype.FeatureGeometry = function(cacheable, type) {

    this.geometry_type         = type;
    this.set_flag(EFLAG_CACHEABLE_GEOMETERY, cacheable);

    this.recycle_geometry = function() {
        if (!this.get_flag(EFLAG_CACHEABLE_GEOMETERY)) {
            if (this.geometry != null) {
                this.geometry.dispose();
                this.geometry = undefined;
            }
        }
    };

    this._create_geometry_cached = function() {
        switch(this.geometry_type) {
        case FEATURE_GEOMETRY_TYPE_PLANE:
            this.geometry = QE.manager_heap.get_plane_geometry(this.width, this.height);
            break;
        case FEATURE_GEOMETRY_TYPE_TEXT_3D:
            l('TODO: SUPPORT CACHE AND 3D TEXT!');
            break;
        }
    };

    this._create_geometry_new = function() {
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
    };

    this.create_geometry = function() {
        this.get_flag(EFLAG_CACHEABLE_GEOMETERY) ? this._create_geometry_cached() : this._create_geometry_new();
    };
};