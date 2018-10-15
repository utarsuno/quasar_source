'use strict';

const FLOATING_TEXT_BACKGROUND_DARK_GRAY   = 'rgba(40, 40, 41, .45)'; // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_TRANSPARENT = 'rgba(0, 0, 0, 0)';      // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_DEFAULT     = 'rgba(20, 20, 20, .45)'; // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_ERROR       = 'rgba(57, 0, 6, .45)';   // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_SUCCESS     = 'rgba(30, 63, 30, .45)'; // #pre-process_global_constant

// '#9dff71';
const COLOR_CANVAS_GREEN  = 'rgb(157,255,113,0.75)'; // #pre-process_global_constant
// '#a7f8ff';
const COLOR_CANVAS_TEAL   = 'rgb(167,248,255,0.75)'; // #pre-process_global_constant
// '#f2ff66';
const COLOR_CANVAS_YELLOW = 'rgb(242,255,102,0.75)'; // #pre-process_global_constant
// '#292929';
const COLOR_CANVAS_GRAY   = 'rgb(41,41,41,0.45)';    // #pre-process_global_constant

Object.assign($_QE.prototype, {
    COLOR_RED          : new THREE.Color('#ff5e33'),
    COLOR_BLUE         : new THREE.Color('#0065ff'),
    COLOR_GREEN        : new THREE.Color('#31ff00'),
    COLOR_YELLOW       : new THREE.Color('#faff00'),
    COLOR_WHITE        : new THREE.Color('#ffffff'),
    COLOR_BLACK        : new THREE.Color('#000000'),
    COLOR_TEXT_CONSTANT: new THREE.Color('#0b410f')
});
