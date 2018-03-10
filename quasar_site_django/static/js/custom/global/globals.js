'use strict';

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
const l = console.log;

/* __        __   __                __   __        ___  __  ___  __
  / _` |    /  \ |__)  /\  |       /  \ |__)    | |__  /  `  |  /__`    .
  \__> |___ \__/ |__) /~~\ |___    \__/ |__) \__/ |___ \__,  |  .__/    .*/

// Global managers.
var MANAGER_AUDIO          = null;
var MANAGER_TEXTURE        = null;
var MANAGER_COOKIES        = null;
var MANAGER_WORLD          = null;
var MANAGER_ENTITY         = null;
var MANAGER_MULTIPLAYER    = null;
var MANAGER_SHADER         = null;
var MANAGER_RENDERER       = null;
var MANAGER_INPUT          = null;
var MANAGER_POINTER_LOCK   = null;
var MANAGER_DATA_DISPLAY   = null;
var MANAGER_LOADING        = null;

// Global objects.
var CURRENT_PLAYER = null;
var ENTITY_OWNER   = null;

// Global gui objects.
var GUI_PAUSED_MENU      = null;
var GUI_TYPING_INTERFACE = null;

/* __        __   __                          __          __        ___  __
  / _` |    /  \ |__)  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
  \__> |___ \__/ |__) /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/ */

// Asset loader types.
const ASSET_GROUP_AUDIO   = 'audio';
const ASSET_GROUP_TEXTURE = 'texture';

const PLAYER_STATE_PAUSED       = 1;
const PLAYER_STATE_AJAX         = 2;
const PLAYER_STATE_LOADING      = 3;
const PLAYER_STATE_ENGAGED      = 4;
const PLAYER_STATE_FULL_CONTROL = 5;
const PLAYER_STATE_TYPING       = 6;

var CURRENT_DAY_OBJECT = null;

// Tags
const TYPE_INPUT_DATE     = 'input_date';
const TYPE_INPUT_TIME     = 'input_time';
const NO_DATE_SELECTED    = 'select date';
const NO_TIME_SELECTED    = 'select time';
const TAG_COMPLETED       = 'completed';
const TAG_NOT_COMPLETED   = 'not_completed';
const TAG_COMPLETED_LABEL = 'completed_label';

// Logical constants.
const NOT_FOUND = -1;

// TODO : Clean up this design.
const SAVE_TAG_3D_ROW = '3d_row';
const SAVE_TAG_2D_ROW = '2d_row';
const NO_SAVE_DATA = 'no_save_data';

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
const ENTITY_TYPE_BASE                   = 'Entity';
const ENTITY_TYPE_TASK                   = 'EntityTask';
const ENTITY_TYPE_WALL                   = 'EntityWall';
const ENTITY_TYPE_ENTITY_WALL            = 'EntityWallEntity';
const ENTITY_TYPE_OWNER                  = 'EntityOwner';
const ENTITY_TYPE_TEXT_REMINDER          = 'EntityTextReminder';
const ENTITY_TYPE_VIDEO                  = 'EntityVideo';
const ENTITY_TYPE_PICTURE                = 'EntityFloatingPicture';
const ENTITY_TYPE_DYNAMIC_WORLD          = 'EntityDynamicWorld';
const ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER = 'EntityDynamicWorldsManager';
const ENTITY_TYPE_STATIC_WORLD           = 'EntityStaticWorld';
const ENTITY_TYPE_STATIC_WORLDS_MANAGER  = 'EntityStaticWorldsManager';
// UNIVERSAL_CONSTANTS_END

const ENTITY_STATIC_WORLD_HOME     = 'home';
const ENTITY_STATIC_WORLD_SETTINGS = 'settings';
const ENTITY_STATIC_WORLD_ADMIN    = 'admin';

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
const ENTITY_PROPERTY_TEXT_CONTENTS       = ENTITY_PROPERTY_START_TOKEN + 'text_contents';
const ENTITY_PROPERTY_EXECUTE_DATE        = ENTITY_PROPERTY_START_TOKEN + 'execute_date';
const ENTITY_PROPERTY_EXECUTE_TIME        = ENTITY_PROPERTY_START_TOKEN + 'execute_time';
const ENTITY_PROPERTY_SERVER_ID           = ENTITY_PROPERTY_START_TOKEN + '_id';
const ENTITY_PROPERTY_IMPORTANCE          = ENTITY_PROPERTY_START_TOKEN + 'importance';
const ENTITY_PROPERTY_IMAGE_DATA          = ENTITY_PROPERTY_START_TOKEN + 'image_data';
const ENTITY_PROPERTY_IS_ROOT_ATTACHABLE  = ENTITY_PROPERTY_START_TOKEN + 'is_root_attachable';
const ENTITY_PROPERTY_3D_ROWS             = ENTITY_PROPERTY_START_TOKEN + '3d_rows';
const ENTITY_PROPERTY_2D_ROWS             = ENTITY_PROPERTY_START_TOKEN + '2d_rows';
const ENTITY_PROPERTY_TAGS                = ENTITY_PROPERTY_START_TOKEN + 'tags';
const ENTITY_PROPERTY_NOTE                = ENTITY_PROPERTY_START_TOKEN + 'note';
const ENTITY_PROPERTY_CREATED_AT_DATE     = ENTITY_PROPERTY_START_TOKEN + 'created_at_date';

const ENTITY_PROPERTY_GROUP_NAME          = ENTITY_PROPERTY_START_TOKEN + 'group_name';

const ENTITY_PROPERTY_MONTH_TYPE          = ENTITY_PROPERTY_START_TOKEN + 'month_type';

const ENTITY_PROPERTY_START_DATE_TIME     = ENTITY_PROPERTY_START_TOKEN + 'start_date_time';
const ENTITY_PROPERTY_END_DATE_TIME       = ENTITY_PROPERTY_START_TOKEN + 'end_date_time';
const ENTITY_PROPERTY_TIME_DURATION       = ENTITY_PROPERTY_START_TOKEN + 'time_duration';
const ENTITY_PROPERTY_TIME_NEEDED         = ENTITY_PROPERTY_START_TOKEN + 'time_needed';
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

const ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE = ENTITY_PROPERTY_START_TOKEN + 'account_type';

const ACCOUNT_TYPE_NOT_VERIFIED = 'not_verified';
const ACCOUNT_TYPE_INTERNAL     = 'internal';
const ACCOUNT_TYPE_DEFAULT      = 'default';
const ACCOUNT_TYPE_ADMIN        = 'admin';
const ACCOUNT_TYPE_SUDO         = 'sudo';

const POST_KEY_GENERIC_DATA                        = 'generic_data_key';
const SERVER_COMMAND_SUDO_OPERATION                = 'eoo';
const SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE = 'seoat';
const SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION  = 'gaai';
const SERVER_COMMAND_DELETE_ENTITY_OWNER           = 'deo';


// UNIVERSAL_CONSTANTS_START : POST URLs for client-server communication.
const POST_URL_GET_SHARED_WORLDS     = '/get_shared_worlds';
const POST_URL_DELETE_ENTITY         = '/delete_entity';
const POST_URL_SAVE_ENTITY           = '/save_entity';
const POST_URL_GET_USER_ENTITIES     = '/get_user_entities';
const POST_URL_CREATE_ACCOUNT        = '/create_account';
const POST_URL_LOGIN                 = '/login';
const POST_URL_GET_SERVER_LOGS       = '/get_server_logs';
// UNIVERSAL_CONSTANTS_END

// Cookie keys.
const COOKIE_SHOULD_REMEMBER_USERNAME = 'should_remember_username';
const COOKIE_REMEMBERED_USERNAME      = 'remembered_username';

// UNIVERSAL_CONSTANTS_START : Floating text types.
const TYPE_PASSWORD               = 'password';
const TYPE_INPUT                  = 'input';
const TYPE_ICON                   = 'icon';
const TYPE_BUTTON                 = 'button';
const TYPE_TITLE                  = 'title';
const TYPE_SUPER_TITLE            = 'super_title';
const TYPE_CHECK_BOX              = 'check_box';
const TYPE_CONSTANT               = 'constant';
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
const BACKGROUND_COLOR_FOCUS   = [264241, '#264241'];
const BACKGROUND_COLOR_ERROR   = '#390006';
const BACKGROUND_COLOR_SUCCESS = '#1e3f1e';

// UNIVERSAL_CONSTANTS_START : Colors and utility indexes.
const COLOR_STRING_INDEX            = 1;
const COLOR_HEX_INDEX               = 0;
const COLOR_HIGHLIGHT               = [0xD4FF93, '#D4FF93'];
const COLOR_PLANET                  = [0xAFE0FF, '#AFE0FF'];
const COLOR_TEXT_DEFAULT            = [0x67ffbf, '#67ffbf'];
const COLOR_TEXT_BUTTON             = [0x60d6ff, '#60d6ff'];
const COLOR_RED                     = [0xff5e33, '#ff5e33'];
const COLOR_ORANGE                  = [0xFF7F00, '#FF7F00'];
const COLOR_GREEN                   = [0x6cff61, '#6cff61'];
const COLOR_YELLOW                  = [0xf3ff5b, '#f3ff5b'];
const COLOR_BLUE                    = [0x2a33ff, '#2a33ff'];
const COLOR_DARK_PURPLE             = [0x4B0082, '#4B0082'];
const COLOR_LIGHT_PURPLE            = [0x8F00FF, '#8F00FF'];
const COLOR_TEXT_CONSTANT           = [0x7e58b0, '#7e58b0'];
const COLOR_WHITE                   = [0xffffff, '#ffffff'];
const COLOR_BLACK                   = [0x000000, '#000000'];
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
const COLOR_MONDAY                  = [0xff9162, '#ff9162'];
const COLOR_TUESDAY                 = [0xffba5d, '#ffba5d'];
const COLOR_WEDNESDAY               = [0xfff883, '#fff883'];
const COLOR_THURSDAY                = [0xdaff90, '#daff90'];
const COLOR_FRIDAY                  = [0xafff84, '#afff84'];
const COLOR_SATURDAY                = [0x68ff6c, '#68ff6c'];
const COLOR_SUNDAY                  = [0x5aff94, '#5aff94'];
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Texture types.
const TEXTURE_GROUP_SKYBOX = 'skybox';
const TEXTURE_GROUP_CURSOR = 'cursors';
const TEXTURE_GROUP_ICONS  = 'icons';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Textures for icons.
const ICON_STAR          = 'star.png';
const ICON_EXIT          = 'exit.png';
const ICON_SETTINGS      = 'gear.png';
const ICON_MULTI_PLAYER  = 'multiplayer.png';
const ICON_HOME          = 'home.png';
const ICON_SAVE          = 'save.png';
const ICON_ENTITY_GROUP  = 'share.png';
const ICON_FULLSCREEN    = 'larger.png';
const ICON_LEFT          = 'arrow_left.png';
const ICON_RIGHT         = 'arrow_right.png';
const ICON_CROSS         = 'cross.png';
const ICON_WORLDS        = 'bars_horizontal.png';
const ICON_LOCKED        = 'locked.png';
const ICON_UNLOCKED      = 'unlocked.png';
const ICON_WARNING       = 'warning.png';
const ICON_TELEPORT      = 'open.png';
const ICON_CHECKMARK     = 'checkmark.png';
const ICON_SINGLE_PLAYER = 'singleplayer.png';
const ICON_WRENCH        = 'wrench.png';
const ICON_IMPORT        = 'import.png';
const ICON_INFORMATION   = 'information.png';
const ICON_MOVIE         = 'movie.png';
const ICON_MENU_LIST     = 'menu_list.png';
// UNIVERSAL_CONSTANTS_END

// TODO : Audio stuff.
const AUDIO_TYPING_SOUND = 'typing_sound.wav';

// UNIVERSAL_CONSTANTS_START : Textures for skybox.
const SKYBOX_FRONT  = 'front.jpg';
const SKYBOX_BACK   = 'back.jpg';
const SKYBOX_LEFT   = 'left.jpg';
const SKYBOX_RIGHT  = 'right.jpg';
const SKYBOX_TOP    = 'top.jpg';
const SKYBOX_BOTTOM = 'bottom.jpg';
// UNIVERSAL_CONSTANTS_END

// UNIVERSAL_CONSTANTS_START : Cursor types.
const CURSOR_TYPE_HORIZONTAL = 'scroll_horizontal.png';
const CURSOR_TYPE_VERTICAL   = 'scroll_vertical.png';
const CURSOR_TYPE_LARGER     = 'larger.png';
const CURSOR_TYPE_HAND       = 'cursor_hand.png';
const CURSOR_TYPE_POINTER    = 'cursor_pointer.png';
const CURSOR_TYPE_MOUSE      = 'mouse.png';
// UNIVERSAL_CONSTANTS_END

const TEXT_FORMAT_LEFT         = 'text_format_left';
const TEXT_FORMAT_CENTER       = 'text_format_center';
const TEXT_FORMAT_RIGHT        = 'text_format_right';

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

const ATTACHMENT_NAME_WARNING = 'attachment_warning';
const ATTACHMENT_NAME_SUCCESS = 'attachment_success';
const ATTACHMENT_NAME_ERROR   = 'attachment_error';
const ATTACHMENT_NAME_TOOLTIP = 'attachment_tooltip';

const ATTACHMENT_TYPE_FLOATING_WALL    = 'attachment_type_floating_wall';
const ATTACHMENT_TYPE_FLOATING_TEXT    = 'attachment_type_floating_wall';
const ATTACHMENT_TYPE_FLOATING_PICTURE = 'attachment_type_floating_picture';
const ATTACHMENT_TYPE_FLOATING_VIDEO   = 'attachment_type_floating_video';

const ATTACHMENT_OFFSET_HORIZONTAL_RIGHT = 'horizontal_offset_right';
const ATTACHMENT_OFFSET_HORIZONTAL_LEFT  = 'horizontal_offset_right';
const ATTACHMENT_OFFSET_VERTICAL_UP      = 'vertical_offset_up';
const ATTACHMENT_OFFSET_VERTICAL_DOWN    = 'vertical_offset_down';
const ATTACHMENT_OFFSET_DEPTH            = 'depth_offset';

// UNIVERSAL_CONSTANTS_START : Text syntax error checks.
const TEXT_SYNTAX_STANDARD_LENGTH = 'Text length must be greater than 3 characters and less than 32.';
const TEXT_SYNTAX_EMAIL           = 'Text must match email snytax rules.';
const TEXT_SYNTAX_MATCH_PASSWORDS = 'Passwords must match!';
// UNIVERSAL_CONSTANTS_END

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
function len(o) {
    if (o.hasOwnProperty('length')) {
        return o.length;
    }
    l('TODO : Object o needs to be supported : ');
    l(o);
    return -1;
}

function str(o) {
    return o.toString();
}

function int(f) {
    return f | 0;
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

function is_defined(object) {
    return object !== null && object !== undefined;
}

// Base code from : https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
function is_email_valid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

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