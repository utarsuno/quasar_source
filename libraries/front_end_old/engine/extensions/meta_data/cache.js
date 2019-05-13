Object.assign($_QE.prototype, {

    _events: [null],

    // Cached references.
    _cacher_document_body   : document.body,
    _cacher_document_element: document.documentElement,

    // Cache.
    _frames_passed  : 0,
    _frame_iteration: 0,
    _delta_clock    : new THREE.Clock(false),
    _delta          : 0,

    _log_history: {
        'error'  : [],
        'warning': [],
        'output' : []
    },

    // C O N T R O L S.
    key_down_up     : false,
    key_down_down   : false,
    key_down_left   : false,
    key_down_right  : false,
    key_down_space  : false,
    key_down_shift  : false,
    key_down_v      : false,
    key_down_control: false,

    // E V E N T {drag and drop}
    // Lazy loaded.
    _ei_file_reader      : null,
    // Position{0} in this queue logically represents the current file being processed.
    // Positions 1-Length are remaining images to be processed (potentially including current image being processed).
    _ei_queue_file       : [null],
    // Useful cache value.
    _ei_current_file_type: null,

    get_event_callback: function(event_callback_name) {
        if (event_callback_name in this._events) {
            return this._events[event_callback_name];
        }
        return null;
    },

    // F O N T S. TODO: Need to allow completely dynamic sizing, remove these constants.
    FONT_ARIAL_8      : new $_QE.prototype.Font('16px Helvetica' , 16, 2),
    FONT_ARIAL_12     : new $_QE.prototype.Font('24px Inconsolata' , 24, 6), // 4
    FONT_ARIAL_16     : new $_QE.prototype.Font('32px Helvetica' , 32, 6),
    FONT_ARIAL_20     : new $_QE.prototype.Font('40px Helvetica' , 40, 9), // tried 12
    FONT_ARIAL_24     : new $_QE.prototype.Font('48px Helvetica' , 48, 10),
    FONT_ARIAL_28     : new $_QE.prototype.Font('56px Helvetica' , 56, 12),
    FONT_ARIAL_32     : new $_QE.prototype.Font('64px Inconsolata' , 64, 14),
    FONT_ARIAL_8_BOLD : new $_QE.prototype.Font('bold 16px Helvetica' , 16, 2),
    FONT_ARIAL_12_BOLD: new $_QE.prototype.Font('bold 24px Helvetica' , 24, 6), // 4
    FONT_ARIAL_16_BOLD: new $_QE.prototype.Font('bold 32px Helvetica' , 32, 6),
    FONT_ARIAL_20_BOLD: new $_QE.prototype.Font('bold 40px Helvetica' , 40, 9), // tried 12
    FONT_ARIAL_24_BOLD: new $_QE.prototype.Font('bold 48px Helvetica' , 48, 10),
    FONT_ARIAL_28_BOLD: new $_QE.prototype.Font('bold 56px Helvetica' , 56, 12),
    FONT_ARIAL_32_BOLD: new $_QE.prototype.Font('bold 64px Helvetica' , 64, 14),

    // C O L O R S.
    COLOR_YELLOW          : new THREE.Color('#ffff00'),
    COLOR_WHITE           : new THREE.Color('#ffffff'),
    COLOR_BLACK           : new THREE.Color('#000000'),

    COLOR_TEAL            : new THREE.Color('#00ffff'),
    COLOR_TEAL_LIGHT      : new THREE.Color('#7fffff'),
    COLOR_GREEN           : new THREE.Color('#00ff00'),
    COLOR_GREEN_LIGHT     : new THREE.Color('#7fff7f'),
    COLOR_RED             : new THREE.Color('#ff0900'),
    COLOR_RED_LIGHT       : new THREE.Color('#ff7f7f'),
    COLOR_BLUE            : new THREE.Color('#0000ff'),
    COLOR_BLUE_LIGHT      : new THREE.Color('#7f7fff'),
    COLOR_BLUE_LIGHTER    : new THREE.Color('#caf0ff'),

    COLOR_GRAY_DARK       : new THREE.Color('#282828'),

    // Shader outline glow.
    COLOR_GLOW_HOVER      : new THREE.Color('#88ecff'),
    COLOR_GLOW_ENGAGED    : new THREE.Color('#28ff8e'),

    // Shader background.
    COLOR_BACKGROUND_INNER: new THREE.Color('#505050'),
    COLOR_BACKGROUND_OUTER: new THREE.Color('#111111'),

    COLOR_RGBA_TRANSPARENT: 'rgba(0,0,0,0)',

    COLOR_RGB_YELLOW      : 'rgb(255,255,0,1.0)',
    COLOR_RGB_GREEN       : 'rgb(0,255,0,1.0)',
    COLOR_RGB_GREEN_LIGHT : 'rgb(127,255,127,1.0)',
    COLOR_RGB_RED         : 'rgb(255,0,0,1.0)',
    COLOR_RGB_RED_LIGHT   : 'rgb(255,127,127,1.0)',
    COLOR_RGB_WHITE       : 'rgb(255,255,255,1.0)',
    COLOR_RGB_BLACK       : 'rgb(0,0,0,1.0)',

    COLOR_RGBA_FADE_RANGE : [
        'rgba(1,1,1,0)', 'rgba(1,1,1,0.01)', 'rgba(1,1,1,0.02)', 'rgba(1,1,1,0.03)', 'rgba(1,1,1,0.04)', 'rgba(1,1,1,0.05)', 'rgba(1,1,1,0.06)',
        'rgba(1,1,1,0.07)', 'rgba(1,1,1,0.08)', 'rgba(1,1,1,0.09)', 'rgba(1,1,1,0.1)', 'rgba(1,1,1,0.11)', 'rgba(1,1,1,0.12)', 'rgba(1,1,1,0.13)',
        'rgba(1,1,1,0.14)', 'rgba(1,1,1,0.15)', 'rgba(1,1,1,0.16)', 'rgba(1,1,1,0.17)', 'rgba(1,1,1,0.18)', 'rgba(1,1,1,0.19)', 'rgba(1,1,1,0.2)',
        'rgba(1,1,1,0.21)', 'rgba(1,1,1,0.22)', 'rgba(1,1,1,0.23)', 'rgba(1,1,1,0.24)', 'rgba(1,1,1,0.25)', 'rgba(1,1,1,0.26)', 'rgba(1,1,1,0.27)',
        'rgba(1,1,1,0.28)', 'rgba(1,1,1,0.29)', 'rgba(1,1,1,0.3)', 'rgba(1,1,1,0.31)', 'rgba(1,1,1,0.32)', 'rgba(1,1,1,0.33)', 'rgba(1,1,1,0.34)',
        'rgba(1,1,1,0.35)', 'rgba(1,1,1,0.36)', 'rgba(1,1,1,0.37)', 'rgba(1,1,1,0.38)', 'rgba(1,1,1,0.39)', 'rgba(1,1,1,0.4)', 'rgba(1,1,1,0.41)',
        'rgba(1,1,1,0.42)', 'rgba(1,1,1,0.43)', 'rgba(1,1,1,0.44)', 'rgba(1,1,1,0.45)', 'rgba(1,1,1,0.46)', 'rgba(1,1,1,0.47)', 'rgba(1,1,1,0.48)',
        'rgba(1,1,1,0.49)', 'rgba(1,1,1,0.5)', 'rgba(1,1,1,0.51)', 'rgba(1,1,1,0.52)', 'rgba(1,1,1,0.53)', 'rgba(1,1,1,0.54)', 'rgba(1,1,1,0.55)',
        'rgba(1,1,1,0.56)', 'rgba(1,1,1,0.57)', 'rgba(1,1,1,0.58)', 'rgba(1,1,1,0.59)', 'rgba(1,1,1,0.6)', 'rgba(1,1,1,0.61)', 'rgba(1,1,1,0.62)',
        'rgba(1,1,1,0.63)', 'rgba(1,1,1,0.64)', 'rgba(1,1,1,0.65)', 'rgba(1,1,1,0.66)', 'rgba(1,1,1,0.67)', 'rgba(1,1,1,0.68)', 'rgba(1,1,1,0.69)',
        'rgba(1,1,1,0.7)', 'rgba(1,1,1,0.71)', 'rgba(1,1,1,0.72)', 'rgba(1,1,1,0.73)', 'rgba(1,1,1,0.74)', 'rgba(1,1,1,0.75)', 'rgba(1,1,1,0.76)',
        'rgba(1,1,1,0.77)', 'rgba(1,1,1,0.78)', 'rgba(1,1,1,0.79)', 'rgba(1,1,1,0.8)', 'rgba(1,1,1,0.81)', 'rgba(1,1,1,0.82)', 'rgba(1,1,1,0.83)',
        'rgba(1,1,1,0.84)', 'rgba(1,1,1,0.85)', 'rgba(1,1,1,0.86)', 'rgba(1,1,1,0.87)', 'rgba(1,1,1,0.88)', 'rgba(1,1,1,0.89)', 'rgba(1,1,1,0.9)',
        'rgba(1,1,1,0.91)', 'rgba(1,1,1,0.92)', 'rgba(1,1,1,0.93)', 'rgba(1,1,1,0.94)', 'rgba(1,1,1,0.95)', 'rgba(1,1,1,0.96)', 'rgba(1,1,1,0.97)',
        'rgba(1,1,1,0.98)', 'rgba(1,1,1,0.99)', 'rgba(1,1,1,1)'
    ],

    COLOR_RGBA_FADE_RANGE_PAUSE_TEXT : [
        'rgba(236,255,240,0)', 'rgba(236,255,240,0.01)', 'rgba(236,255,240,0.02)', 'rgba(236,255,240,0.03)', 'rgba(236,255,240,0.04)', 'rgba(236,255,240,0.05)', 'rgba(236,255,240,0.06)',
        'rgba(236,255,240,0.07)', 'rgba(236,255,240,0.08)', 'rgba(236,255,240,0.09)', 'rgba(236,255,240,0.1)', 'rgba(236,255,240,0.11)', 'rgba(236,255,240,0.12)', 'rgba(236,255,240,0.13)',
        'rgba(236,255,240,0.14)', 'rgba(236,255,240,0.15)', 'rgba(236,255,240,0.16)', 'rgba(236,255,240,0.17)', 'rgba(236,255,240,0.18)', 'rgba(236,255,240,0.19)', 'rgba(236,255,240,0.2)',
        'rgba(236,255,240,0.21)', 'rgba(236,255,240,0.22)', 'rgba(236,255,240,0.23)', 'rgba(236,255,240,0.24)', 'rgba(236,255,240,0.25)', 'rgba(236,255,240,0.26)', 'rgba(236,255,240,0.27)',
        'rgba(236,255,240,0.28)', 'rgba(236,255,240,0.29)', 'rgba(236,255,240,0.3)', 'rgba(236,255,240,0.31)', 'rgba(236,255,240,0.32)', 'rgba(236,255,240,0.33)', 'rgba(236,255,240,0.34)',
        'rgba(236,255,240,0.35)', 'rgba(236,255,240,0.36)', 'rgba(236,255,240,0.37)', 'rgba(236,255,240,0.38)', 'rgba(236,255,240,0.39)', 'rgba(236,255,240,0.4)', 'rgba(236,255,240,0.41)',
        'rgba(236,255,240,0.42)', 'rgba(236,255,240,0.43)', 'rgba(236,255,240,0.44)', 'rgba(236,255,240,0.45)', 'rgba(236,255,240,0.46)', 'rgba(236,255,240,0.47)', 'rgba(236,255,240,0.48)',
        'rgba(236,255,240,0.49)', 'rgba(236,255,240,0.5)', 'rgba(236,255,240,0.51)', 'rgba(236,255,240,0.52)', 'rgba(236,255,240,0.53)', 'rgba(236,255,240,0.54)', 'rgba(236,255,240,0.55)',
        'rgba(236,255,240,0.56)', 'rgba(236,255,240,0.57)', 'rgba(236,255,240,0.58)', 'rgba(236,255,240,0.59)', 'rgba(236,255,240,0.6)', 'rgba(236,255,240,0.61)', 'rgba(236,255,240,0.62)',
        'rgba(236,255,240,0.63)', 'rgba(236,255,240,0.64)', 'rgba(236,255,240,0.65)', 'rgba(236,255,240,0.66)', 'rgba(236,255,240,0.67)', 'rgba(236,255,240,0.68)', 'rgba(236,255,240,0.69)',
        'rgba(236,255,240,0.7)', 'rgba(236,255,240,0.71)', 'rgba(236,255,240,0.72)', 'rgba(236,255,240,0.73)', 'rgba(236,255,240,0.74)', 'rgba(236,255,240,0.75)', 'rgba(236,255,240,0.76)',
        'rgba(236,255,240,0.77)', 'rgba(236,255,240,0.78)', 'rgba(236,255,240,0.79)', 'rgba(236,255,240,0.8)', 'rgba(236,255,240,0.81)', 'rgba(236,255,240,0.82)', 'rgba(236,255,240,0.83)',
        'rgba(236,255,240,0.84)', 'rgba(236,255,240,0.85)', 'rgba(236,255,240,0.86)', 'rgba(236,255,240,0.87)', 'rgba(236,255,240,0.88)', 'rgba(236,255,240,0.89)', 'rgba(236,255,240,0.9)',
        'rgba(236,255,240,0.91)', 'rgba(236,255,240,0.92)', 'rgba(236,255,240,0.93)', 'rgba(236,255,240,0.94)', 'rgba(236,255,240,0.95)', 'rgba(236,255,240,0.96)', 'rgba(236,255,240,0.97)',
        'rgba(236,255,240,0.98)', 'rgba(236,255,240,0.99)', 'rgba(236,255,240,1)'
    ],

    COLOR_RGBA_FADE_RANGE_BORDER : [
        'rgba(101,128,84,0)', 'rgba(101,128,84,0.01)', 'rgba(101,128,84,0.02)', 'rgba(101,128,84,0.03)', 'rgba(101,128,84,0.04)', 'rgba(101,128,84,0.05)', 'rgba(101,128,84,0.06)',
        'rgba(101,128,84,0.07)', 'rgba(101,128,84,0.08)', 'rgba(101,128,84,0.09)', 'rgba(101,128,84,0.1)', 'rgba(101,128,84,0.11)', 'rgba(101,128,84,0.12)', 'rgba(101,128,84,0.13)',
        'rgba(101,128,84,0.14)', 'rgba(101,128,84,0.15)', 'rgba(101,128,84,0.16)', 'rgba(101,128,84,0.17)', 'rgba(101,128,84,0.18)', 'rgba(101,128,84,0.19)', 'rgba(101,128,84,0.2)',
        'rgba(101,128,84,0.21)', 'rgba(101,128,84,0.22)', 'rgba(101,128,84,0.23)', 'rgba(101,128,84,0.24)', 'rgba(101,128,84,0.25)', 'rgba(101,128,84,0.26)', 'rgba(101,128,84,0.27)',
        'rgba(101,128,84,0.28)', 'rgba(101,128,84,0.29)', 'rgba(101,128,84,0.3)', 'rgba(101,128,84,0.31)', 'rgba(101,128,84,0.32)', 'rgba(101,128,84,0.33)', 'rgba(101,128,84,0.34)',
        'rgba(101,128,84,0.35)', 'rgba(101,128,84,0.36)', 'rgba(101,128,84,0.37)', 'rgba(101,128,84,0.38)', 'rgba(101,128,84,0.39)', 'rgba(101,128,84,0.4)', 'rgba(101,128,84,0.41)',
        'rgba(101,128,84,0.42)', 'rgba(101,128,84,0.43)', 'rgba(101,128,84,0.44)', 'rgba(101,128,84,0.45)', 'rgba(101,128,84,0.46)', 'rgba(101,128,84,0.47)', 'rgba(101,128,84,0.48)',
        'rgba(101,128,84,0.49)', 'rgba(101,128,84,0.5)', 'rgba(101,128,84,0.51)', 'rgba(101,128,84,0.52)', 'rgba(101,128,84,0.53)', 'rgba(101,128,84,0.54)', 'rgba(101,128,84,0.55)',
        'rgba(101,128,84,0.56)', 'rgba(101,128,84,0.57)', 'rgba(101,128,84,0.58)', 'rgba(101,128,84,0.59)', 'rgba(101,128,84,0.6)', 'rgba(101,128,84,0.61)', 'rgba(101,128,84,0.62)',
        'rgba(101,128,84,0.63)', 'rgba(101,128,84,0.64)', 'rgba(101,128,84,0.65)', 'rgba(101,128,84,0.66)', 'rgba(101,128,84,0.67)', 'rgba(101,128,84,0.68)', 'rgba(101,128,84,0.69)',
        'rgba(101,128,84,0.7)', 'rgba(101,128,84,0.71)', 'rgba(101,128,84,0.72)', 'rgba(101,128,84,0.73)', 'rgba(101,128,84,0.74)', 'rgba(101,128,84,0.75)', 'rgba(101,128,84,0.76)',
        'rgba(101,128,84,0.77)', 'rgba(101,128,84,0.78)', 'rgba(101,128,84,0.79)', 'rgba(101,128,84,0.8)', 'rgba(101,128,84,0.81)', 'rgba(101,128,84,0.82)', 'rgba(101,128,84,0.83)',
        'rgba(101,128,84,0.84)', 'rgba(101,128,84,0.85)', 'rgba(101,128,84,0.86)', 'rgba(101,128,84,0.87)', 'rgba(101,128,84,0.88)', 'rgba(101,128,84,0.89)', 'rgba(101,128,84,0.9)',
        'rgba(101,128,84,0.91)', 'rgba(101,128,84,0.92)', 'rgba(101,128,84,0.93)', 'rgba(101,128,84,0.94)', 'rgba(101,128,84,0.95)', 'rgba(101,128,84,0.96)', 'rgba(101,128,84,0.97)',
        'rgba(101,128,84,0.98)', 'rgba(101,128,84,0.99)', 'rgba(101,128,84,1)'
    ],

});
