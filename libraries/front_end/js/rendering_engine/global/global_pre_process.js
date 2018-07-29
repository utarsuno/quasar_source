'use strict';

const FEATURE_GEOMETRY_TYPE_PLANE   = 0; // #pre-process_global_constant
const FEATURE_GEOMETRY_TYPE_TEXT_3D = 1; // #pre-process_global_constant

const FEATURE_MATERIAL_TYPE_TEXT_3D = 0; // #pre-process_global_constant
const FEATURE_MATERIAL_TYPE_ICON    = 1; // #pre-process_global_constant
const FEATURE_MATERIAL_CANVAS_BASIC = 2; // #pre-process_global_constant
const FEATURE_MATERIAL_CANVAS_FANCY = 3; // #pre-process_global_constant
const FEATURE_MATERIAL_CANVAS_SHINY = 4; // #pre-process_global_constant

const FEATURE_MESH_TYPE_DEFAULT = 0; // #pre-process_global_constant

const DOM_ELEMENT_CANVAS = 'canvas'; // #pre-process_global_constant
const DOM_ELEMENT_DIV    = 'div';    // #pre-process_global_constant
const DOM_ELEMENT_H1     = 'h1';     // #pre-process_global_constant
const DOM_ELEMENT_H2     = 'h2';     // #pre-process_global_constant
const DOM_ELEMENT_H3     = 'h3';     // #pre-process_global_constant
const DOM_ELEMENT_H4     = 'h4';     // #pre-process_global_constant
const DOM_ELEMENT_H5     = 'h5';     // #pre-process_global_constant

const DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS = 0; // #pre-process_global_constant
const DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE    = 1; // #pre-process_global_constant
const DOM_ELEMENT_CONSTRUCTOR_TYPE_ELEMENT        = 2; // #pre-process_global_constant



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

/*___  ___     ___                 __           __  ___      ___  ___
   |  |__  \_/  |      /\  |    | / _` |\ |    /__`  |   /\   |  |__
   |  |___ / \  |     /~~\ |___ | \__> | \|    .__/  |  /~~\  |  |___ */
const TEXT_ALIGN_STATE_START  = 0; // #pre-process_global_constant
const TEXT_ALIGN_STATE_CENTER = 1; // #pre-process_global_constant
const TEXT_ALIGN_STATE_END    = 2; // #pre-process_global_constant
/*__                       __
 /  `  /\  |\ | \  /  /\  /__`
 \__, /~~\ | \|  \/  /~~\ .__/ */
const CANVAS_RENDERING_ROWS            = 0;     // #pre-process_global_constant
const CANVAS_RENDERING_SINGLE          = 1;     // #pre-process_global_constant
const CANVAS_RENDERING_ICON            = 2;     // #pre-process_global_constant

const CANVAS_GUI_2D_ABSOLUTE_PIXELS    = true;  // #pre-process_global_constant
const CANVAS_GUI_2D_RELATIVE_TO_SCREEN = false; // #pre-process_global_constant

const CANVAS_MATERIAL_STYLE_BASIC      = 0;     // #pre-process_global_constant
const CANVAS_MATERIAL_STYLE_FANCY      = 1;     // #pre-process_global_constant
const CANVAS_MATERIAL_STYLE_SHINY      = 2;     // #pre-process_global_constant

const CAVNAS_FONT_SMALLER              = 0;     // #pre-process_global_constant
const CAVNAS_FONT_LARGER               = 1;     // #pre-process_global_constant

const CANVAS_FONT_INDEX_NAME           = 0;     // #pre-process_global_constant
const CANVAS_FONT_INDEX_SIZE           = 1;     // #pre-process_global_constant
const CANVAS_FONT_INDEX_OFFSET         = 2;     // #pre-process_global_constant


/*     __   __   ___ ___  __
  /\  /__` /__` |__   |  /__`
 /~~\ .__/ .__/ |___  |  .__/ */
const ASSET_TEXTURE_SPRITE_SHEET  = 'p0.png'; // #pre-process_global_constant
const ASSET_TEXTURE_TRANSITION    = 'p1.png'; // #pre-process_global_constant
const ASSET_TEXTURE_FONT_DEFAULT  = 'p2.png'; // #pre-process_global_constant
const ASSET_TEXTURE_FONT_LARGER   = 'p3.png'; // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_FRONT  = 'f.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_BACK   = 'ba.jpg'; // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_LEFT   = 'l.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_RIGHT  = 'r.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_TOP    = 't.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_BOTTOM = 'bo.jpg'; // #pre-process_global_constant

const ASSET_SHADER_MATERIAL_TRANSITION  = 'sm1'; // #pre-process_global_constant
const ASSET_SHADER_MATERIAL_NOISE       = 'sm2'; // #pre-process_global_constant
const ASSET_SHADER_MATERIAL_SPRITE_SHEET = 'sm3'; // #pre-process_global_constant


const ICON_ADMIN      = 0;  // #pre-process_global_constant
const ICON_ARROW      = 1;  // #pre-process_global_constant
const ICON_CALENDER   = 2;  // #pre-process_global_constant
const ICON_CHECKMARK  = 3;  // #pre-process_global_constant
const ICON_CLICK      = 4;  // #pre-process_global_constant
const ICON_CROSS      = 5;  // #pre-process_global_constant
const ICON_CURSOR     = 6;  // #pre-process_global_constant
const ICON_DELETE     = 7;  // #pre-process_global_constant
const ICON_DISABLED   = 8;  // #pre-process_global_constant
const ICON_DRAG       = 9;  // #pre-process_global_constant
const ICON_EXIT       = 10; // #pre-process_global_constant
const ICON_EXPAND     = 11; // #pre-process_global_constant
const ICON_FOLDER     = 12; // #pre-process_global_constant
const ICON_GEARS      = 13; // #pre-process_global_constant
const ICON_HOME       = 14; // #pre-process_global_constant
const ICON_HORIZONTAL = 15; // #pre-process_global_constant
const ICON_LOCKED     = 16; // #pre-process_global_constant
const ICON_PICTURE    = 17; // #pre-process_global_constant
const ICON_PLANET     = 18; // #pre-process_global_constant
const ICON_TELEPORT   = 19; // #pre-process_global_constant
const ICON_TEXT       = 20; // #pre-process_global_constant
const ICON_UNLOCKED   = 21; // #pre-process_global_constant
const ICON_VERTICAL   = 22; // #pre-process_global_constant
const ICON_VIDEO      = 23; // #pre-process_global_constant
const ICON_WARNING    = 24; // #pre-process_global_constant
const ICON_WRENCH     = 25; // #pre-process_global_constant
const ICON_WRITING    = 26; // #pre-process_global_constant


const ASSET_TYPE_SHADER_MATERIAL = 1; // #pre-process_global_constant
const ASSET_TYPE_TEXTURE         = 2; // #pre-process_global_constant

