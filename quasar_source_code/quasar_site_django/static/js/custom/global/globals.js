'use strict'

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
const l = console.log

/* __        __   __                          __          __        ___  __
  / _` |    /  \ |__)  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
  \__> |___ \__/ |__) /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/ */

// Logical constants.
const NOT_FOUND = -1

// Math constants.
const HALF_PIE = Math.PI / 2.0
const PIE = Math.PI
const TWO_PIE = Math.PI * 2.0

// Player object sets the global audio.
var AUDIO_MANAGER  = null
var GLOBAL_COOKIES = Cookies.noConflict()
var WORLD_MANAGER  = null

// Entity.
var ENTITY_MANAGER = null
// Entity types.
const ENTITY_TYPE_TASK          = 'EntityTask'
const ENTITY_TYPE_TIME          = 'EntityTime'
const ENTITY_TYPE_BASE          = 'Entity'
const ENTITY_TYPE_WALL          = 'EntityWall'
const ENTITY_TYPE_OWNER         = 'EntityOwner'
const ENTITY_TYPE_TEXT_REMINDER = 'EntityTextReminder'
const ENTITY_TYPE_NO_SPECIAL_TYPE = 'EntityNoSpecialType'
// This list will only contain the user creatable Entity Types.
const ENTITY_TYPE_ALL           = [ENTITY_TYPE_NO_SPECIAL_TYPE, ENTITY_TYPE_TEXT_REMINDER, ENTITY_TYPE_TASK, ENTITY_TYPE_TIME, ENTITY_TYPE_BASE]

// Entity properties.
// TODO : Only list the default properties here
const ENTITY_PROPERTY_ID        = 'ENTITY_PROPERTY_ID'
const ENTITY_PROPERTY_TYPE      = 'ENTITY_PROPERTY_TYPE'
const ENTITY_PROPERTY_NAME      = 'ENTITY_PROPERTY_NAME'
const ENTITY_PROPERTY_POSITION  = 'ENTITY_PROPERTY_POSITION'
const ENTITY_PROPERTY_LOOK_AT   = 'ENTITY_PROPERTY_LOOK_AT'
const ENTITY_PROPERTY_PARENTS   = 'ENTITY_PROPERTY_PARENTS'
const ENTITY_PROPERTY_CHILDREN  = 'ENTITY_PROPERTY_CHILDREN'
const ENTITY_PROPERTY_COMPLETED = 'ENTITY_PROPERTY_COMPLETED'

const TEMP_PROPERTY_A = 'Text Contents :'
const TEMP_PROPERTY_B = 'Seconds from now :'
const TEMP_PROPERTY_C = 'Send to :'

const ENTITY_PROPERTY_ALL       = [TEMP_PROPERTY_A, TEMP_PROPERTY_B, TEMP_PROPERTY_C, ENTITY_PROPERTY_COMPLETED, ENTITY_PROPERTY_ID, ENTITY_PROPERTY_TYPE, ENTITY_PROPERTY_NAME, ENTITY_PROPERTY_POSITION, ENTITY_PROPERTY_LOOK_AT, ENTITY_PROPERTY_PARENTS, ENTITY_PROPERTY_CHILDREN]

// Cookie keys.
const COOKIE_SHOULD_REMEMBER_USERNAME = 'should_remember_username'
const COOKIE_REMEMBERED_USERNAME      = 'remembered_username'

// Floating2DText types.
const TYPE_INPUT_PASSWORD = 1 // Input password field.
const TYPE_INPUT_REGULAR  = 2 // Regular input field.
const TYPE_LABEL          = 3 // Static text.
const TYPE_BUTTON         = 4 // Static text that can be clicked.
const TYPE_STATUS         = 5 // Dynamic non-interactive text.
const TYPE_TITLE          = 6 // Static title text.
const TYPE_CHECK_BOX      = 7 // Just the X character when checked.
const TYPE_SUPER_TITLE    = 8 // Super large text.
const TYPE_CONSTANT_TEXT  = 9 // Purple lookable but not engable or editable text.

// Server response messages.
const SERVER_REPLY_INVALID_POST_DATA_ERROR                = 'Invalid POST data!'
const SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = 'Invalid number of POST arguments!'
const SERVER_REPLY_GENERIC_NO                             = 'n'
const SERVER_REPLY_GENERIC_YES                            = 'y'
const SERVER_REPLY_GENERIC_SERVER_ERROR                   = 'Server Error!'

// Server post data keys.
const POST_USERNAME   = 'username'
const POST_PASSWORD   = 'password'
const POST_SAVE_DATA  = 'save_data'
const POST_EMAIL      = 'email'
const POST_MANAGER_ID = 'manager_id'
const POST_OWNER_ID   = 'owner_id'

// Pre-defined colors.
const COLOR_HIGHLIGHT      = 0xD4FF93
const COLOR_TEXT_HIGHLIGHT = '#D4FF93'
const COLOR_TEXT_PLANET    = 0xAFE0FF
const COLOR_TEXT_DEFAULT   = '#67ffbf'
const COLOR_TEXT_BUTTON    = '#60d6ff'
const COLOR_TEXT_RED       = '#ff5e33'
const COLOR_TEXT_GREEN     = '#6cff61'
const COLOR_TEXT_CONSTANT  = '#7e58b0'
const COLOR_WHITE          = '#ffffff'
const COLOR_BLACK          = '#000000'
const COLOR_HEX_BLACK      = 0x000000

// Mouse-click events.
const MOUSE_LEFT_CLICK   = 0
const MOUSE_MIDDLE_CLICK = 1
const MOUSE_RIGHT_CLICK  = 2

// Key-down key-codes.
const KEY_CODE_SHIFT      = 16
const KEY_CODE_SPACE      = 32
const KEY_CODE_UP         = 38
const KEY_CODE_LEFT       = 37
const KEY_CODE_RIGHT      = 39
const KEY_CODE_DOWN       = 40
const KEY_CODE_0          = 48
const KEY_CODE_1          = 49
const KEY_CODE_2          = 50
const KEY_CODE_3          = 51
const KEY_CODE_4          = 52
const KEY_CODE_5          = 53
const KEY_CODE_6          = 54
const KEY_CODE_7          = 55
const KEY_CODE_8          = 56
const KEY_CODE_9          = 57
const KEY_CODE_A          = 65
const KEY_CODE_B          = 66
const KEY_CODE_C          = 67
const KEY_CODE_D          = 68
const KEY_CODE_E          = 69
const KEY_CODE_F          = 70
const KEY_CODE_G          = 71
const KEY_CODE_H          = 72
const KEY_CODE_I          = 73
const KEY_CODE_J          = 74
const KEY_CODE_K          = 75
const KEY_CODE_L          = 76
const KEY_CODE_M          = 77
const KEY_CODE_N          = 78
const KEY_CODE_O          = 79
const KEY_CODE_P          = 80
const KEY_CODE_Q          = 81
const KEY_CODE_R          = 82
const KEY_CODE_S          = 83
const KEY_CODE_T          = 84
const KEY_CODE_U          = 85
const KEY_CODE_V          = 86
const KEY_CODE_W          = 87
const KEY_CODE_X          = 88
const KEY_CODE_Y          = 89
const KEY_CODE_Z          = 90
const KEY_CODE_DELETE     = 8
const KEY_CODE_TAB        = 9
const KEY_CODE_ENTER      = 13
const KEY_CODE_CONTROL    = 17
const KEY_CODE_BACK_SLASH = 220

// Javascript constants.
const VISIBLE = 'visible'
const NOT_VISIBLE = 'hidden'
const DISPLAY_NONE = 'none'
const DISPLAY_SHOW = 'block'

/* __        __   __                ___            __  ___    __        __
  / _` |    /  \ |__)  /\  |       |__  |  | |\ | /  `  |  | /  \ |\ | /__`
  \__> |___ \__/ |__) /~~\ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/ */

// Base code from : https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
function is_email_valid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

function get_key_value_list_from_json_dictionary(json_data) {
    var return_list = []
    for (var key in json_data) {
        // check if the property/key is defined in the object itself, not in parent
        if (json_data.hasOwnProperty(key)) {
            return_list.push([key, json_data[key]])
        }
    }
    return return_list
}
