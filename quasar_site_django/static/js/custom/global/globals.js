'use strict';

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
const l = console.log;

function is_defined(object) {
    return object !== null && object !== undefined;
}

/* __        __   __                __   __        ___  __  ___  __
  / _` |    /  \ |__)  /\  |       /  \ |__)    | |__  /  `  |  /__`    .
  \__> |___ \__/ |__) /~~\ |___    \__/ |__) \__/ |___ \__,  |  .__/    .*/

// Global managers.
var MANAGER_MANAGER      = null;
var MANAGER_WEB_SOCKETS  = null;
var MANAGER_AUDIO        = null;
var MANAGER_TEXTURE      = null;
var MANAGER_WORLD        = null;
var MANAGER_ENTITY       = null;
var MANAGER_MULTIPLAYER  = null;
var MANAGER_SHADER       = null;
var MANAGER_RENDERER     = null;
var MANAGER_INPUT        = null;
var MANAGER_POINTER_LOCK = null;
//var MANAGER_LOADING      = null;

// Global objects.
var CURRENT_CLIENT = null;
var CURRENT_PLAYER = null;
var ENTITY_OWNER   = null;

// Global gui objects.
var GUI_PAUSED_MENU = null;

/* __        __   __                          __          __        ___  __
  / _` |    /  \ |__)  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
  \__> |___ \__/ |__) /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/ */

// Logical constants.
const NOT_FOUND = -1; // #pre-process_global_constant

// Tags
const NO_DATE_SELECTED    = 'select date';
const NO_TIME_SELECTED    = 'select time';
const TAG_COMPLETED       = 'completed';

// TODO : Clean up this design.
const SAVE_TAG_3D_ROW = '3d_row';
const SAVE_TAG_2D_ROW = '2d_row';
const NO_SAVE_DATA = 'no_save_data';

// TODO : Delete these after refactorings occur!
const POST_KEY_GENERIC_DATA                        = 'generic_data_key';
const SERVER_COMMAND_SUDO_OPERATION                = 'eoo';
const SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE = 'seoat';
const SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION  = 'gaai';
const SERVER_COMMAND_DELETE_ENTITY_OWNER           = 'deo';

// UNIVERSAL_CONSTANTS_START : Colors and utility indexes.

// TEMPORARY TESTING.
const COLOR_RED           = new THREE.Color('#ff5e33');
const COLOR_BLUE          = new THREE.Color('#0065ff');
const COLOR_GREEN         = new THREE.Color('#31ff00');
const COLOR_YELLOW        = new THREE.Color('#faff00');
const COLOR_BLACK         = new THREE.Color('#000000');
const COLOR_TEXT_CONSTANT = new THREE.Color('#0b410f');
const COLOR_TEXT_DEFAULT  = new THREE.Color('#67ffbf');
//const COLOR_TEXT_BUTTON   = new THREE.Color();

const FLOATING_TEXT_BACKGROUND_TRANSPARENT = 'rgba(0, 0, 0, 0)';      // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_DEFAULT     = 'rgba(20, 20, 20, .65)'; // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_ERROR       = 'rgba(57, 0, 6, .65)';   // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_SUCCESS     = 'rgba(30, 63, 30, .65)'; // #pre-process_global_constant

// TODO : REFACTOR/REMOVE THE ENTIRE OLD COLOR SYSTEM.
const COLOR_STRING_INDEX            = 1;
const COLOR_HEX_INDEX               = 0;
const COLOR_HIGHLIGHT               = [0xD4FF93, '#D4FF93'];
const COLOR_TEXT_BUTTON             = [0x60d6ff, '#60d6ff'];
const COLOR_ORANGE                  = [0xFF7F00, '#FF7F00'];
const COLOR_DARK_PURPLE             = [0x4B0082, '#4B0082'];
const COLOR_LIGHT_PURPLE            = [0x8F00FF, '#8F00FF'];
const COLOR_WHITE                   = [0xffffff, '#ffffff'];
const COLOR_SCHEDULE_PAST           = [0x0b3162, '#09254b'];
const COLOR_SCHEDULE_PRESENT        = [0x8effae, '#4dff78'];
const COLOR_SCHEDULE_FUTURE         = [0x000b1c, '#d58900'];
const COLOR_FLOATING_WALL_BASE      = [0x151515, '#151515'];
const COLOR_FLOATING_WALL_YELLOW    = [0x3c3406, '#3c3406'];
const COLOR_FLOATING_WALL_TOP       = [0xacdfbc, '#acdfbc'];
const COLOR_FLOATING_WALL_HIGHLIGHT = [0x152319, '#001f23'];
const COLOR_FLOATING_WALL_SUCCESS   = [0x092300, '#092300'];
const COLOR_FLOATING_WALL_ERROR     = [0x230002, '#230002'];
const COLOR_TRANSPARENT             = 'rgba(255, 255, 255, 0.0)';
const COLOR_SEMI_TRANSPARENT        = 'rgba(153, 204, 255, 0.05)';
const COLOR_MONDAY                  = [0xff9162, '#ff9162'];
const COLOR_TUESDAY                 = [0xffba5d, '#ffba5d'];
const COLOR_WEDNESDAY               = [0xfff883, '#fff883'];
const COLOR_THURSDAY                = [0xdaff90, '#daff90'];
const COLOR_FRIDAY                  = [0xafff84, '#afff84'];
const COLOR_SATURDAY                = [0x68ff6c, '#68ff6c'];
const COLOR_SUNDAY                  = [0x5aff94, '#5aff94'];
// UNIVERSAL_CONSTANTS_END

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

/* __        __   __                ___            __  ___    __        __
  / _` |    /  \ |__)  /\  |       |__  |  | |\ | /  `  |  | /  \ |\ | /__`
  \__> |___ \__/ |__) /~~\ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/ */

// From : https://stackoverflow.com/questions/12623272/how-to-check-if-a-string-array-contains-one-string-in-javascript
Array.prototype.contains = function(element) {
    return this.indexOf(element) > -1;
}

/* __      ___       __           __           ___                       ___      ___    __
  |__) \ /  |  |__| /  \ |\ |    /__` \ / |\ |  |   /\  \_/    |  |\/| |  |   /\   |  | /  \ |\ |
  |     |   |  |  | \__/ | \|    .__/  |  | \|  |  /~~\ / \    |  |  | |  |  /~~\  |  | \__/ | \| */
function str(o) {
    return o.toString();
}

function int(f) {
    return f | 0;
}

function CustomException(message) {
    this.message = message;
    this.name = 'CustomException';
}

function raise_exception_with_full_logging(message) {
    l(message);
    CURRENT_CLIENT.add_server_message_red(message);
    throw new CustomException(message);
}

function raise_exception(message) {
    throw new CustomException(message);
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