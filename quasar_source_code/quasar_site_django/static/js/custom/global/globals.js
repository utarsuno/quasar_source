'use strict';

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
const l = console.log;

/* __        __   __                __   __        ___  __  ___  __
  / _` |    /  \ |__)  /\  |       /  \ |__)    | |__  /  `  |  /__`    .
  \__> |___ \__/ |__) /~~\ |___    \__/ |__) \__/ |___ \__,  |  .__/    .*/

// Global managers.
var MANAGER_AUDIO       = null;
var MANAGER_COOKIES     = null;
var MANAGER_WORLD       = null;
var MANAGER_ENTITY      = null;
var MANAGER_MULTIPLAYER = null;
var MANAGER_SHADER      = null;

// Global objects.
var CURRENT_PLAYER = null;
var ENTITY_OWNER   = null;

// Global gui objects.
var GUI_PAUSED_MENU      = null;
var GUI_TYPING_INTERFACE = null;

/* __        __   __                          __          __        ___  __
  / _` |    /  \ |__)  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
  \__> |___ \__/ |__) /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/ */

// World math constants.
const DIAGONAL_PENALTY = Math.sqrt(.5);
const GROUND_NORMAL    = new THREE.Vector3(0, 1, 0);
const ONE_THIRD        = 1 / 3;
const TWO_THIRDS       = 2 / 3;

// Logical constants.
const NOT_FOUND = -1;

// Math constants.
const HALF_PIE = Math.PI / 2.0;
const PIE = Math.PI;
const TWO_PIE = Math.PI * 2.0;

// UNIVERSAL_CONSTANTS_START : Web socket message types.
const WEB_SOCKET_MESSAGE_TYPE_ALL_PLAYERS                 = '|A|';
const WEB_SOCKET_MESSAGE_TYPE_CONNECTION                  = '|C|';
const WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED                = '|D|';
const WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE                = '|M|';
const WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE              = '|L|';
const WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE             = '|P|';
const WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE = '|U|';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Entity types.
const ENTITY_TYPE_BASE          = 'Entity';
const ENTITY_TYPE_TASK          = 'EntityTask';
const ENTITY_TYPE_TIME          = 'EntityTime';
const ENTITY_TYPE_WALL          = 'EntityWall';
const ENTITY_TYPE_OWNER         = 'EntityOwner';
const ENTITY_TYPE_TEXT_REMINDER = 'EntityTextReminder';
const ENTITY_TYPE_ALL           = [ENTITY_TYPE_BASE, ENTITY_TYPE_TASK, ENTITY_TYPE_TIME, ENTITY_TYPE_WALL, ENTITY_TYPE_OWNER, ENTITY_TYPE_TEXT_REMINDER];
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Entity property keys.
const ENTITY_PROPERTY_START_TOKEN         = 'ep_';
const ENTITY_PROPERTY_PUBLIC              = ENTITY_PROPERTY_START_TOKEN + 'public';
const ENTITY_PROPERTY_OWNER               = ENTITY_PROPERTY_START_TOKEN + 'owner';
const ENTITY_PROPERTY_PASSWORD            = ENTITY_PROPERTY_START_TOKEN + 'password';
const ENTITY_PROPERTY_USERNAME            = ENTITY_PROPERTY_START_TOKEN + 'username';
const ENTITY_PROPERTY_EMAIL               = ENTITY_PROPERTY_START_TOKEN + 'email';
const ENTITY_PROPERTY_NAME                = ENTITY_PROPERTY_START_TOKEN + 'name';
const ENTITY_PROPERTY_POSITION            = ENTITY_PROPERTY_START_TOKEN + 'position';
const ENTITY_PROPERTY_WIDTH               = ENTITY_PROPERTY_START_TOKEN + 'width';
const ENTITY_PROPERTY_HEIGHT              = ENTITY_PROPERTY_START_TOKEN + 'height';
const ENTITY_PROPERTY_NORMAL              = ENTITY_PROPERTY_START_TOKEN + 'normal';
const ENTITY_PROPERTY_NORMAL_DEPTH        = ENTITY_PROPERTY_START_TOKEN + 'normal_depth';
const ENTITY_PROPERTY_HORIZONTAL_OFFSET   = ENTITY_PROPERTY_START_TOKEN + 'horizontal_offset';
const ENTITY_PROPERTY_VERTICAL_OFFSET     = ENTITY_PROPERTY_START_TOKEN + 'vertical_offset';
const ENTITY_PROPERTY_COMPLETED           = ENTITY_PROPERTY_START_TOKEN + 'completed';
const ENTITY_PROPERTY_PHONE_NUMBER        = ENTITY_PROPERTY_START_TOKEN + 'phone_number';
const ENTITY_PROPERTY_PHONE_CARRIER       = ENTITY_PROPERTY_START_TOKEN + 'phone_carrier';
const ENTITY_PROPERTY_CREATED_AT_DATE     = ENTITY_PROPERTY_START_TOKEN + 'created_at_date';
const ENTITY_PROPERTY_DUE_DATE            = ENTITY_PROPERTY_START_TOKEN + 'due_date';
const ENTITY_PROPERTY_TEXT_CONTENTS       = ENTITY_PROPERTY_START_TOKEN + 'text_contents';
const ENTITY_PROPERTY_DUE_TIME            = ENTITY_PROPERTY_START_TOKEN + 'due_time';
const ENTITY_PROPERTY_EXECUTE_DATE        = ENTITY_PROPERTY_START_TOKEN + 'execute_date';
const ENTITY_PROPERTY_EXECUTE_TIME        = ENTITY_PROPERTY_START_TOKEN + 'execute_time';
const ENTITY_PROPERTY_SERVER_ID           = ENTITY_PROPERTY_START_TOKEN + '_id';
const ENTITY_PROPERTY_IMPORTANCE          = ENTITY_PROPERTY_START_TOKEN + 'importance';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Entity default property keys.
const ENTITY_DEFAULT_PROPERTY_TYPE        = ENTITY_PROPERTY_START_TOKEN + 'type';
const ENTITY_DEFAULT_PROPERTY_CHILD_IDS   = ENTITY_PROPERTY_START_TOKEN + 'child_ids';
const ENTITY_DEFAULT_PROPERTY_PARENT_IDS  = ENTITY_PROPERTY_START_TOKEN + 'parent_ids';
const ENTITY_DEFAULT_PROPERTY_RELATIVE_ID = ENTITY_PROPERTY_START_TOKEN + 'relative_id';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Entity POST keys.
const ENTITY_POST_SAVE_DATA = 'save_data';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : POST URLs for client-server communication.
const POST_URL_DELETE_ENTITY         = '/delete_entity';
const POST_URL_SAVE_ENTITY           = '/save_entity';
const POST_URL_GET_USER_ENTITIES     = '/get_user_entities';
const POST_URL_GET_PUBLIC_ENTITIES   = '/get_public_entities';
const POST_URL_CREATE_ACCOUNT        = '/create_account';
const POST_URL_LOGIN                 = '/login';
const POST_URL_ENTITY_MANAGER_STATUS = '/server_side_print_entity_manager_status';
const POST_URL_GET_DATABASE_DATA     = '/get_database_data';
const POST_URL_GET_ALL_SERVER_CACHE  = '/get_all_server_cache';
const POST_URL_GET_SERVER_LOGS       = '/get_server_logs';
// UNIVERSAL_CONSTANTS_END

// Cookie keys.
const COOKIE_SHOULD_REMEMBER_USERNAME = 'should_remember_username';
const COOKIE_REMEMBERED_USERNAME      = 'remembered_username';

// UNIVERSAL_CONSTANTS_START : Floating text types.
const TYPE_INPUT_PASSWORD         = 'input_password';
const TYPE_INPUT_REGULAR          = 'input_regular';
const TYPE_LABEL                  = 'label';
const TYPE_BUTTON                 = 'button';
const TYPE_STATUS                 = 'status';
const TYPE_TITLE                  = 'title';
const TYPE_CHECK_BOX              = 'check_box';
const TYPE_SUPER_TITLE            = 'super_title';
const TYPE_CONSTANT_TEXT          = 'constant_text';
const TYPE_SLIDER                 = 'slider';
const TYPE_TWO_DIRECTIONAL_SLIDER = 'two_directional_slider';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Server reply message.
const SERVER_REPLY_INVALID_POST_DATA_ERROR                = 'Invalid POST data!';
const SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = 'Invalid number of POST arguments!';
const SERVER_REPLY_GENERIC_NO                             = 'n';
const SERVER_REPLY_GENERIC_YES                            = 'y';
const SERVER_REPLY_GENERIC_SERVER_ERROR                   = 'Server Error!';
// UNIVERSAL_CONSTANTS_END

const BACKGROUND_COLOR_DEFAULT = '#000000';
const BACKGROUND_COLOR_FOCUS   = '#264241';
const BACKGROUND_COLOR_ERROR   = '#390006';
const BACKGROUND_COLOR_SUCCESS = '#1e3f1e';

// TODO (global todo) : all modules that have independent resource loading should be abstracted
// TODO : Use less color constants and generate them at startup instead.
// UNIVERSAL_CONSTANTS_START : Colors and utility indexes.
const COLOR_STRING_INDEX     = 1;
const COLOR_HEX_INDEX        = 0;
const COLOR_HIGHLIGHT        = [0xD4FF93, '#D4FF93'];
const COLOR_PLANET           = [0xAFE0FF, '#AFE0FF'];
const COLOR_TEXT_DEFAULT     = [0x67ffbf, '#67ffbf'];
const COLOR_TEXT_BUTTON      = [0x60d6ff, '#60d6ff'];
const COLOR_RED              = [0xff5e33, '#ff5e33'];
const COLOR_GREEN            = [0x6cff61, '#6cff61'];
const COLOR_TEXT_CONSTANT    = [0x7e58b0, '#7e58b0'];
const COLOR_WHITE            = [0xffffff, '#ffffff'];
const COLOR_BLACK            = [0x000000, '#000000'];
const COLOR_DAY_PAST_SEVEN   = [0x00362a, '#002411'];
const COLOR_DAY_PAST_SIX     = [0x004b3a, '#09312f'];
const COLOR_DAY_PAST_FIVE    = [0x00614b, '#113e4d'];
const COLOR_DAY_PAST_FOUR    = [0x008164, '#1a4b6b'];
const COLOR_DAY_PAST_THREE   = [0x00b78e, '#225788'];
const COLOR_DAY_PAST_TWO     = [0x00dbaa, '#2b64a6'];
const COLOR_DAY_PAST_ONE     = [0x00e9b2, '#3371c4'];
const COLOR_DAY_PRESENT      = [0x5db2ff, '#448aff'];
const COLOR_DAY_FUTURE_ONE   = [0x41ff92, '#4b77c3'];
const COLOR_DAY_FUTURE_TWO   = [0x31ff7f, '#4f6ea4'];
const COLOR_DAY_FUTURE_THREE = [0x5eff7c, '#526486'];
const COLOR_DAY_FUTURE_FOUR  = [0x7eff91, '#555a68'];
const COLOR_DAY_FUTURE_FIVE  = [0xa4ff98, '#595149'];
const COLOR_DAY_FUTURE_SIX   = [0xd4ffb3, '#5c472b'];
const COLOR_DAY_FUTURE_SEVEN = [0xfffdb5, '#5f3d0c'];
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Icons.
const ICON_EXIT         = 'exit.png';
const ICON_SETTINGS     = 'gear.png';
const ICON_MULTIPLAYER  = 'massiveMultiplayer.png';
const ICON_HOME         = 'home.png';
const ICON_SAVE         = 'save.png';
const ICON_ENTITY_GROUP = 'share2.png';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Cursor types.
const CURSOR_TYPE_HORIZONTAL = 'scroll_horizontal.png';
const CURSOR_TYPE_VERTICAL   = 'scroll_vertical.png';
const CURSOR_TYPE_LARGER     = 'larger.png';
const CURSOR_TYPE_HAND       = 'cursor_hand.png';
const CURSOR_TYPE_POINTER    = 'cursor_pointer.png';
const CURSOR_TYPE_MOUSE      = 'mouse.png';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Skybox textures.
const SKYBOX_FRONT  = 'front.jpg';
const SKYBOX_BACK   = 'back.jpg';
const SKYBOX_LEFT   = 'left.jpg';
const SKYBOX_RIGHT  = 'right.jpg';
const SKYBOX_TOP    = 'top.jpg';
const SKYBOX_BOTTOM = 'bottom.jpg';
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

// Mouse-click events.
const MOUSE_LEFT_CLICK   = 0;
const MOUSE_MIDDLE_CLICK = 1;
const MOUSE_RIGHT_CLICK  = 2;

// Key-down key-codes.
const KEY_CODE_SHIFT      = 16;
const KEY_CODE_SPACE      = 32;
const KEY_CODE_UP         = 38;
const KEY_CODE_LEFT       = 37;
const KEY_CODE_RIGHT      = 39;
const KEY_CODE_DOWN       = 40;
const KEY_CODE_0          = 48;
const KEY_CODE_1          = 49;
const KEY_CODE_2          = 50;
const KEY_CODE_3          = 51;
const KEY_CODE_4          = 52;
const KEY_CODE_5          = 53;
const KEY_CODE_6          = 54;
const KEY_CODE_7          = 55;
const KEY_CODE_8          = 56;
const KEY_CODE_9          = 57;
const KEY_CODE_A          = 65;
const KEY_CODE_B          = 66;
const KEY_CODE_C          = 67;
const KEY_CODE_D          = 68;
const KEY_CODE_E          = 69;
const KEY_CODE_F          = 70;
const KEY_CODE_G          = 71;
const KEY_CODE_H          = 72;
const KEY_CODE_I          = 73;
const KEY_CODE_J          = 74;
const KEY_CODE_K          = 75;
const KEY_CODE_L          = 76;
const KEY_CODE_M          = 77;
const KEY_CODE_N          = 78;
const KEY_CODE_O          = 79;
const KEY_CODE_P          = 80;
const KEY_CODE_Q          = 81;
const KEY_CODE_R          = 82;
const KEY_CODE_S          = 83;
const KEY_CODE_T          = 84;
const KEY_CODE_U          = 85;
const KEY_CODE_V          = 86;
const KEY_CODE_W          = 87;
const KEY_CODE_X          = 88;
const KEY_CODE_Y          = 89;
const KEY_CODE_Z          = 90;
const KEY_CODE_DELETE     = 8;
const KEY_CODE_TAB        = 9;
const KEY_CODE_ENTER      = 13;
const KEY_CODE_CONTROL    = 17;
const KEY_CODE_BACK_SLASH = 220;

// Javascript constants.
const VISIBLE = 'visible';
const NOT_VISIBLE = 'hidden';
const DISPLAY_NONE = 'none';
const DISPLAY_SHOW = 'block';

/* __        __   __                ___            __  ___    __        __
  / _` |    /  \ |__)  /\  |       |__  |  | |\ | /  `  |  | /  \ |\ | /__`
  \__> |___ \__/ |__) /~~\ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/ */


/* __      ___       __           __           ___                       ___      ___    __
  |__) \ /  |  |__| /  \ |\ |    /__` \ / |\ |  |   /\  \_/    |  |\/| |  |   /\   |  | /  \ |\ |
  |     |   |  |  | \__/ | \|    .__/  |  | \|  |  /~~\ / \    |  |  | |  |  /~~\  |  | \__/ | \| */
function len(o) {
    if (o.hasOwnProperty('length')) {
        return o.length;
    }
    return -1;
}

function str(o) {
    return o.toString();
}

function int(f) {
    return f | 0;
}


// Math shortcuts.
function cos(n) {
    return Math.cos(n);
}

function sin(n) {
    return Math.sin(n);
}

function sqrt(n) {
    return Math.sqrt(n);
}

function squared(n) {
    return n * n;
}

// From : https://stackoverflow.com/questions/4398711/round-to-the-nearest-power-of-two
function get_nearest_power_of_two_for_number(n) {
    var v = n;

    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++; // next power of 2

    var x = v >> 1; // previous power of 2

    return (v - n) > (n - x) ? x : v;
}

function is_entity_property(property) {
    return property.startsWith(ENTITY_PROPERTY_START_TOKEN);
}

function CustomException(message) {
    this.message = message;
    this.name = 'CustomException';
}

function raise_exception_with_full_logging(message) {
    l(message);
    GUI_TYPING_INTERFACE.add_server_message(message);
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

function round_to_n_decimal_places(text, n) {
    return Number(text).toFixed(n);
}

function is_defined(object) {
    return object !== null && object !== undefined;
}

// Base code from : https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
function is_email_valid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function get_key_value_list_from_json_dictionary(json_data) {
    var return_list = [];
    for (var key in json_data) {
        // check if the property/key is defined in the object itself, not in parent
        if (json_data.hasOwnProperty(key)) {
            return_list.push([key, json_data[key]]);
        }
    }
    return return_list;
}



// TODO : Make this into a function later.
// Base from : https://stackoverflow.com/questions/30143082/how-to-get-color-value-from-gradient-by-percentage-with-javascript
/*
ratios = [0, 1, 2, 3, 4, 5, 6, 7];

var color1 = '448aff';
var color2 = '5f3d0c';

var hex = function(x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
};

function pickHex(color1, color2, weight) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}

for (var i = 0; i < ratios.length; i++) {
	var ratio = i / ratios.length;
  var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

	var middle = hex(r) + hex(g) + hex(b);
	console.log(middle);
}
 */