'use strict'

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
const l = console.log

/* __        __   __                          __          __        ___  __
  / _` |    /  \ |__)  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
  \__> |___ \__/ |__) /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/ */

// Player object sets the global audio.
var AUDIO_MANAGER  = null
var GLOBAL_COOKIES = Cookies.noConflict()
var WORLD_MANAGER  = null

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

// Server response messages.
const SERVER_REPLY_INVALID_POST_DATA_ERROR                = 'Invalid POST data!'
const SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = 'Invalid number of POST arguments!'
const SERVER_REPLY_GENERIC_NO                             = 'n'
const SERVER_REPLY_GENERIC_YES                            = 'y'
const SERVER_REPLY_GENERIC_SERVER_ERROR                   = 'Server Error!'

// Pre-defined colors.
const COLOR_HIGHLIGHT      = 0xD4FF93
const COLOR_TEXT_HIGHLIGHT = '#D4FF93'
const COLOR_TEXT_DEFAULT   = '#67ffbf'
const COLOR_WHITE          = '#ffffff'
const COLOR_BLACK          = '#000000'

// Base code from : https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
function is_email_valid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}