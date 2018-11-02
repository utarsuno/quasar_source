'use strict';

const FLOATING_TEXT_BACKGROUND_ERROR       = 'rgba(57, 0, 6, .45)';   // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_SUCCESS     = 'rgba(30, 63, 30, .45)'; // #pre-process_global_constant

// '#ff5e33';
const COLOR_CANVAS_RED    = 'rgb(255,94,51,1.0)'; // #pre-process_global_constant

// '#9dff71';
//COLOR_CANVAS_GREEN = 'rgb(157,255,113,1.0)';


// '#a7f8ff';
const COLOR_CANVAS_TEAL   = 'rgb(167,248,255,0.75)'; // #pre-process_global_constant
// '#f2ff66';
const COLOR_CANVAS_YELLOW = 'rgb(242,255,102,0.75)'; // #pre-process_global_constant
// '#292929';
const COLOR_CANVAS_GRAY   = 'rgb(41,41,41,0.45)';    // #pre-process_global_constant
// '#4d0005';
const COLOR_CANVAS_DARK_RED = 'rgb(77, 0, 5, 0.6)'; // #pre-process_global_constant

// Old above.

Object.assign($_QE.prototype, {
    // Old
    COLOR_DARK_GREEN      : new THREE.Color('#004100'),

    // New
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


    COLOR_BACKGROUND_INNER: new THREE.Color('#505050'),
    COLOR_BACKGROUND_OUTER: new THREE.Color('#111111'),

    COLOR_RGBA_TRANSPARENT: 'rgba(0,0,0,0)',

    COLOR_RGB_YELLOW      : 'rgb(255,255,0,1.0)',
    COLOR_RGB_GREEN       : 'rgb(0,255,0,1.0)',
    COLOR_RGB_GREEN_LIGHT : 'rgb(127,255,127,1.0)',
    COLOR_RGB_RED         : 'rgb(255,0,0,1.0)',
    COLOR_RGB_RED_LIGHT   : 'rgb(255,127,127,1.0)'

});
