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

// Global objects.
var CURRENT_PLAYER = null;
var ENTITY_OWNER   = null;

// Global gui objects.
var GUI_PAUSED_MENU      = null;
var GUI_TYPING_INTERFACE = null;

/* __        __   __                          __          __        ___  __
  / _` |    /  \ |__)  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
  \__> |___ \__/ |__) /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/ */

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
const ENTITY_PROPERTY_LOOK_AT             = ENTITY_PROPERTY_START_TOKEN + 'look_at';
const ENTITY_PROPERTY_COMPLETED           = ENTITY_PROPERTY_START_TOKEN + 'completed';
const ENTITY_PROPERTY_PHONE_NUMBER        = ENTITY_PROPERTY_START_TOKEN + 'phone_number';
const ENTITY_PROPERTY_PHONE_CARRIER       = ENTITY_PROPERTY_START_TOKEN + 'phone_carrier';
const ENTITY_PROPERTY_CREATED_AT_DATE     = ENTITY_PROPERTY_START_TOKEN + 'created_at_date';
const ENTITY_PROPERTY_DUE_DATE            = ENTITY_PROPERTY_START_TOKEN + 'due_date';
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

const TEMP_PROPERTY_A = 'Text Contents :';
const TEMP_PROPERTY_B = 'Seconds from now :';
const TEMP_PROPERTY_C = 'Send to :';

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
const COLOR_DAY_PAST_SEVEN   = [0x00362a, '#00362a'];
const COLOR_DAY_PAST_SIX     = [0x004b3a, '#004b3a'];
const COLOR_DAY_PAST_FIVE    = [0x00614b, '#00614b'];
const COLOR_DAY_PAST_FOUR    = [0x008164, '#008164'];
const COLOR_DAY_PAST_THREE   = [0x00b78e, '#00b78e'];
const COLOR_DAY_PAST_TWO     = [0x00dbaa, '#00dbaa'];
const COLOR_DAY_PAST_ONE     = [0x00e9b2, '#00e9b2'];
const COLOR_DAY_PRESENT      = [0x5db2ff, '#5db2ff'];
const COLOR_DAY_FUTURE_ONE   = [0x41ff92, '#41ff92'];
const COLOR_DAY_FUTURE_TWO   = [0x31ff7f, '#31ff7f'];
const COLOR_DAY_FUTURE_THREE = [0x5eff7c, '#5eff7c'];
const COLOR_DAY_FUTURE_FOUR  = [0x7eff91, '#7eff91'];
const COLOR_DAY_FUTURE_FIVE  = [0xa4ff98, '#a4ff98'];
const COLOR_DAY_FUTURE_SIX   = [0xd4ffb3, '#d4ffb3'];
const COLOR_DAY_FUTURE_SEVEN = [0xfffdb5, '#fffdb5'];
// UNIVERSAL_CONSTANTS_END

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

// Python syntax imitation.
function len(o) {
    if (o.hasOwnProperty('length')) {
        return o.length;
    }
    return -1;
}

// Python syntax imitation.
function str(o) {
    return o.toString();
}


// Math shortcuts.
function cos(n) {
    return Math.cos(n);
}

function sin(n) {
    return Math.sin(n);
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
