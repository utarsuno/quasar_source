'use strict';

const FEATURE_GEOMETRY_TYPE_PLANE   = 1; // #pre-process_global_constant
const FEATURE_GEOMETRY_TYPE_TEXT_3D = 2; // #pre-process_global_constant

const FEATURE_MATERIAL_TYPE_TEXT_3D = 1; // #pre-process_global_constant
const FEATURE_MATERIAL_TYPE_ICON    = 2; // #pre-process_global_constant
const FEATURE_MATERIAL_CANVAS_BASIC = 3; // #pre-process_global_constant
const FEATURE_MATERIAL_CANVAS_FANCY = 4; // #pre-process_global_constant
const FEATURE_MATERIAL_CANVAS_SHINY = 5; // #pre-process_global_constant

const FEATURE_MESH_TYPE_DEFAULT = 1; // #pre-process_global_constant

const DOM_ELEMENT_CANVAS = 'canvas'; // #pre-process_global_constant
const DOM_ELEMENT_DIV    = 'div';    // #pre-process_global_constant
const DOM_ELEMENT_H1     = 'h1';     // #pre-process_global_constant
const DOM_ELEMENT_H2     = 'h2';     // #pre-process_global_constant
const DOM_ELEMENT_H3     = 'h3';     // #pre-process_global_constant
const DOM_ELEMENT_H4     = 'h4';     // #pre-process_global_constant
const DOM_ELEMENT_H5     = 'h5';     // #pre-process_global_constant

const DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS = 1; // #pre-process_global_constant
const DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE    = 2; // #pre-process_global_constant
const DOM_ELEMENT_CONSTRUCTOR_TYPE_ELEMENT        = 3; // #pre-process_global_constant



// Key-down key-codes.
const KEY_CODE__SHIFT      = 16;           // #pre-process_global_constant
const KEY_CODE__SPACE      = 32;           // #pre-process_global_constant
const KEY_CODE__UP         = 38;           // #pre-process_global_constant
const KEY_CODE__LEFT       = 37;           // #pre-process_global_constant
const KEY_CODE__RIGHT      = 39;           // #pre-process_global_constant
const KEY_CODE__DOWN       = 40;           // #pre-process_global_constant
const KEY_CODE_0           = 48;           // #pre-process_global_constant
const KEY_CODE_1           = 49;           // #pre-process_global_constant
const KEY_CODE_2           = 50;           // #pre-process_global_constant
const KEY_CODE_3           = 51;           // #pre-process_global_constant
const KEY_CODE_4           = 52;           // #pre-process_global_constant
const KEY_CODE_5           = 53;           // #pre-process_global_constant
const KEY_CODE_6           = 54;           // #pre-process_global_constant
const KEY_CODE_7           = 55;           // #pre-process_global_constant
const KEY_CODE_8           = 56;           // #pre-process_global_constant
const KEY_CODE_9           = 57;           // #pre-process_global_constant
const KEY_CODE_A           = 65;           // #pre-process_global_constant
const KEY_CODE_B           = 66;           // #pre-process_global_constant
const KEY_CODE_C           = 67;           // #pre-process_global_constant
const KEY_CODE_D           = 68;           // #pre-process_global_constant
const KEY_CODE_E           = 69;           // #pre-process_global_constant
const KEY_CODE_F           = 70;           // #pre-process_global_constant
const KEY_CODE_G           = 71;           // #pre-process_global_constant
const KEY_CODE_H           = 72;           // #pre-process_global_constant
const KEY_CODE_I           = 73;           // #pre-process_global_constant
const KEY_CODE_J           = 74;           // #pre-process_global_constant
const KEY_CODE_K           = 75;           // #pre-process_global_constant
const KEY_CODE_L           = 76;           // #pre-process_global_constant
const KEY_CODE_M           = 77;           // #pre-process_global_constant
const KEY_CODE_N           = 78;           // #pre-process_global_constant
const KEY_CODE_O           = 79;           // #pre-process_global_constant
const KEY_CODE_P           = 80;           // #pre-process_global_constant
const KEY_CODE_Q           = 81;           // #pre-process_global_constant
const KEY_CODE_R           = 82;           // #pre-process_global_constant
const KEY_CODE_S           = 83;           // #pre-process_global_constant
const KEY_CODE_T           = 84;           // #pre-process_global_constant
const KEY_CODE_U           = 85;           // #pre-process_global_constant
const KEY_CODE_V           = 86;           // #pre-process_global_constant
const KEY_CODE_W           = 87;           // #pre-process_global_constant
const KEY_CODE_X           = 88;           // #pre-process_global_constant
const KEY_CODE_Y           = 89;           // #pre-process_global_constant
const KEY_CODE_Z           = 90;           // #pre-process_global_constant
const KEY_CODE__DELETE     = 8;            // #pre-process_global_constant
const KEY_CODE__TAB        = 9;            // #pre-process_global_constant
const KEY_CODE__ENTER      = 13;           // #pre-process_global_constant
const KEY_CODE__CONTROL    = 17;           // #pre-process_global_constant
const KEY_CODE__BACK_SLASH = 220;          // #pre-process_global_constant

const EVENT_MOUSE_DOWN = 'mousedown';      // #pre-process_global_constant
const EVENT_MOUSE_UP   = 'mouseup';        // #pre-process_global_constant
const EVENT_KEY_DOWN   = 'keydown';        // #pre-process_global_constant
const EVENT_KEY_UP     = 'keyup';          // #pre-process_global_constant
const EVENT_MOUSE_MOVE = 'mousemove';      // #pre-process_global_constant
const EVENT_PASTE      = 'paste';          // #pre-process_global_constant
const EVENT_WHEEL_V0   = 'wheel';          // #pre-process_global_constant
const EVENT_WHEEL_V1   = 'mousewheel';     // #pre-process_global_constant
const EVENT_WHEEL_V2   = 'DOMMouseScroll'; // #pre-process_global_constant

const CLICK_LEFT   = 1;                    // #pre-process_global_constant
const CLICK_MIDDLE = 2;                    // #pre-process_global_constant
const CLICK_RIGHT  = 3;                    // #pre-process_global_constant

