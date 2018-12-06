'use strict';


Object.assign($_QE.prototype, {

    _cachei: new Uint32Array(5),
    _cachef: new Float64Array(13),

    // Cached references.
    _cache_reference_document_body: document.body,

    CACHE_ZERO_VECTOR: new THREE.Vector3(0, 0, 0),
    //CACHE_UP_VECTOR: new THREE.Vector3(0, 1, 0),

    // Cache.
    _frames_passed  : 0,
    _frame_iteration: 0,
    _delta_clock    : new THREE.Clock(false),
    _delta          : 0,

    // Eh, just use the cacei way faster and way less taxing on dynamic memory usage
    // TODO: rename to _vector_cursor
    _cursor         : new THREE.Vector2(),
    // TODO:
    _cachev_dimensions: new THREE.Vector2(),

    __init__cache: function() {
        this._cachef[QECACHEF_FPS_PHYSICS] = 0.011111111111111112; // FPS is 90 (from 1.0 / 90.0).
        this._cachef[QECACHEF_FPS_PAUSED]  = 0.011111111111111112;
        this._cachef[QECACHEF_FPS_RENDER]  = 0.016666666666666666; // FPS is 60 (from 1.0 / 60.0).
        this._cachef[QECACHEF_FPS_LOGIC]   = 0.03333333333333333;  // FPS is 30 (from 1.0 / 30.0).
        this._clear_frames();
    },

    set_width: function(w) {
        this._cachei[QECACHEI_WIDTH_INNER] = w;
    },

    get_width: function() {
        return this._cachei[QECACHEI_WIDTH_INNER];
    },

    get_center_x: function() {
        return Math.floor(this._cachei[QECACHEI_WIDTH_INNER] / 2);
    },

    get_center_y: function() {
        return Math.floor(this._cachei[QECACHEI_HEIGHT_INNER] / 2);
    },

    get_height: function() {
        return this._cachei[QECACHEI_HEIGHT_INNER];
    },

    set_height: function(h) {
        this._cachei[QECACHEI_HEIGHT_INNER] = h;
    },

    // TEMPORARY LOCATION:
    _get_number_of_cpu_cores: function() {
        // Number of logical processors.
        return window.navigator.hardwareConcurrency;
    },

});
