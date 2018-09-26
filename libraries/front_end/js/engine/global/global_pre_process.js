'use strict';

///
const GLOBAL_ID_PAUSED_BACKGROUND_FILTER     = 'a'; // #pre-process_global_constant
const GLOBAL_ID_PAUSE_DISPLAY                = 'b'; // #pre-process_global_constant
const GLOBAL_ID_SUB_PAUSED_DISPLAY_TITLE     = 'c'; // #pre-process_global_constant
const GLOBAL_ID_SUB_PAUSED_DISPLAY_SUB_TITLE = 'd'; // #pre-process_global_constant

const GLOBAL_ID_CURSOR_DEFAULT               = 'f'; // #pre-process_global_constant
const GLOBAL_ID_CURSOR_ICON                  = 'g'; // #pre-process_global_constant

const GLOBAL_ID_GUI_CANVAS                   = 'i'; // #pre-process_global_constant
const GLOBAL_ID_OUTLINE_GREEN                = 'j'; // #pre-process_global_constant
const GLOBAL_ID_CANVAS_MAIN                  = 'k'; // #pre-process_global_constant

const GLOBAL_ID_HUD_DEBUG                    = 'l'; // #pre-process_global_constant
const GLOBAL_ID_HUD_TYPING                   = 'n'; // #pre-process_global_constant
const GLOBAL_ID_HUD_CHAT                     = 'm'; // #pre-process_global_constant
///

const USER_DATA_KEY_PARENT_OBJECT   = 'p'; // #pre-process_global_constant
const IS_CURRENTLY_LOOKED_AT        = 'i'; // #pre-process_global_constant

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

const CANVAS_FONT_INDEX_NAME           = 0;     // #pre-process_global_constant
const CANVAS_FONT_INDEX_SIZE           = 1;     // #pre-process_global_constant
const CANVAS_FONT_INDEX_OFFSET         = 2;     // #pre-process_global_constant


/*     __   __   ___ ___  __
  /\  /__` /__` |__   |  /__`
 /~~\ .__/ .__/ |___  |  .__/ */
const ASSET_TEXTURE_SPRITE_SHEET  = 'p0.png'; // #pre-process_global_constant
const ASSET_TEXTURE_TRANSITION    = 'p1.png'; // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_FRONT  = 'f.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_BACK   = 'ba.jpg'; // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_LEFT   = 'l.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_RIGHT  = 'r.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_TOP    = 't.jpg';  // #pre-process_global_constant
const ASSET_TEXUTRE_SKYBOX_BOTTOM = 'bo.jpg'; // #pre-process_global_constant

const ASSET_SHADER_MATERIAL_TRANSITION  = 'sm1'; // #pre-process_global_constant
const ASSET_SHADER_MATERIAL_NOISE       = 'sm2'; // #pre-process_global_constant
const ASSET_SHADER_MATERIAL_SPRITE_SHEET = 'sm3'; // #pre-process_global_constant


const ASSET_ICON_ADMIN      = 0;  // #pre-process_global_constant
const ASSET_ICON_ARROW      = 1;  // #pre-process_global_constant
const ASSET_ICON_CALENDAR   = 2;  // #pre-process_global_constant
const ASSET_ICON_CHECKMARK  = 3;  // #pre-process_global_constant
const ASSET_ICON_CLICK      = 4;  // #pre-process_global_constant
const ASSET_ICON_CROSS      = 5;  // #pre-process_global_constant
const ASSET_ICON_CURSOR     = 6;  // #pre-process_global_constant
const ASSET_ICON_DELETE     = 7;  // #pre-process_global_constant
const ASSET_ICON_DISABLED   = 8;  // #pre-process_global_constant
const ASSET_ICON_DRAG       = 9;  // #pre-process_global_constant
const ASSET_ICON_EXIT       = 10;  // #pre-process_global_constant
const ASSET_ICON_EXPAND     = 11;  // #pre-process_global_constant
const ASSET_ICON_FOLDER     = 12;  // #pre-process_global_constant
const ASSET_ICON_GEARS      = 13;  // #pre-process_global_constant
const ASSET_ICON_HOME       = 14;  // #pre-process_global_constant
const ASSET_ICON_HORIZONTAL = 15;  // #pre-process_global_constant
const ASSET_ICON_LOCKED     = 16;  // #pre-process_global_constant
const ASSET_ICON_PICTURE    = 17;  // #pre-process_global_constant
const ASSET_ICON_PLANET     = 18;  // #pre-process_global_constant
const ASSET_ICON_TELEPORT   = 19;  // #pre-process_global_constant
const ASSET_ICON_TERMINAL   = 20;  // #pre-process_global_constant
const ASSET_ICON_TEXT       = 21;  // #pre-process_global_constant
const ASSET_ICON_UNLOCKED   = 22;  // #pre-process_global_constant
const ASSET_ICON_VERTICAL   = 23;  // #pre-process_global_constant
const ASSET_ICON_VIDEO      = 24;  // #pre-process_global_constant
const ASSET_ICON_WARNING    = 25;  // #pre-process_global_constant
const ASSET_ICON_WRENCH     = 26;  // #pre-process_global_constant
const ASSET_ICON_WRITTING   = 27;  // #pre-process_global_constant

const ASSET_TYPE_SHADER_MATERIAL = 1; // #pre-process_global_constant
const ASSET_TYPE_TEXTURE         = 2; // #pre-process_global_constant




/*
const CELL_PHONE_CARRIERS = {
    'No Value'         : '',
    'AT&T'             : 'number@txt.att.net',
    'T-Mobile'         : 'number@tmomail.net',
    'Verizon'          : 'number@vtext.com',
    'Sprint'           : 'number@pm.sprint.com',
    'Virgin Mobile'    : 'number@vmobl.com',
    'Tracfone'         : 'number@mmst5.tracfone.com',
    'Metro PCS'        : 'number@mymetropcs.com',
    'Boost Mobile'     : 'number@myboostmobile.com',
    'Cricket'          : 'number@mms.cricketwireless.net',
    'Ptel'             : 'number@ptel.com',
    'Republic Wireless': 'number@text.republicwireless.com',
    'Google Fi'        : 'number@msg.fi.google.com',
    'Suncom'           : 'number@tms.suncom.com',
    'Ting'             : 'number@message.ting.com',
    'U.S. Cellular'    : 'number@email.uscc.net',
    'Consumer Cellular': 'number@cingularme.com',
    'C-Spire'          : 'number@cspire1.com',
    'Page Plus'        : 'number@vtext.com'
};



// From : https://stackoverflow.com/questions/12623272/how-to-check-if-a-string-array-contains-one-string-in-javascript
Array.prototype.contains = function(element) {
    return this.indexOf(element) > -1;
};

function int(f) {
    return f | 0;
}

// From : https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript
function is_string(value) {
    return typeof value === 'string';
}

// From : https://stackoverflow.com/questions/4775722/check-if-object-is-array
function is_list(o) {
    return Array.isArray(o);
}

function string_contains(base_string, sub_string) {
    return base_string.indexOf(sub_string) !== NOT_FOUND;
}

// TODO : Remove the 2 functions below.
// Base code from : https://stackoverflow.com/questions/30143082/how-to-get-color-value-from-gradient-by-percentage-with-javascript
var hex = function(x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
};

function get_color_range_list(start_color, end_color, number_of_colors) {
    if (is_list(start_color)) {
        start_color = start_color[COLOR_STRING_INDEX].replace('#', '');
    } else if (start_color.includes('#')) {
        start_color = start_color.replace('#', '');
    }
    if (is_list(end_color)) {
        end_color = end_color[COLOR_STRING_INDEX].replace('#', '');
    } else if (end_color.includes('#')) {
        end_color = end_color.replace('#', '');
    }
    var colors = [];
    for (var c = 0; c < number_of_colors; c++) {
        var ratio = c / number_of_colors;
        var r = Math.ceil(parseInt(end_color.substring(0,2), 16) * ratio + parseInt(start_color.substring(0,2), 16) * (1 - ratio));
        var g = Math.ceil(parseInt(end_color.substring(2,4), 16) * ratio + parseInt(start_color.substring(2,4), 16) * (1 - ratio));
        var b = Math.ceil(parseInt(end_color.substring(4,6), 16) * ratio + parseInt(start_color.substring(4,6), 16) * (1 - ratio));
        colors.push('#' + hex(r) + hex(g) + hex(b));
    }
    return colors;
}



*/