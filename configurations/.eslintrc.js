module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "globals": {

        "console": false,
        "Cookies": false,

        "THREEx": false,
        "THREE": false,
        "Stats": false,
        "Detector": true,
        "StatsAPI": true,
        "PointerLockAPI": true,
        "CSSRendererAPI": true,
        "FPSControls": true,
        "ShaderAPI": true,
        "Client": true,
        "World": true,
        "WebSocketClient": false,

        "FloatingWall": true,
        "Floating2DText": true,
        "FloatingText": true,
        "Floating3DText": true,
        "FloatingSlider": true,

        // Core
        "InputTextProcessor": false,
        "CustomSmoothStep": false,

        "Owner": true,

        "LoginWorld": true,
        "HomeWorld": true,
        "SettingsWorld": true,

        "PostHelper": true,

        "Interactive"      : true,
        "TextSyntax"       : true,
        "InheritableButton": true,
        "Visibility"       : true,

        "DomElement": false,

        // Global Managers.
        "MANAGER_COOKIES"     : true,
        "MANAGER_AUDIO"       : true,
        "MANAGER_WORLD"       : true,
        "MANAGER_ENTITY"      : true,
        "MANAGER_MULTIPLAYER" : true,
        "MANAGER_SHADER"      : true,
        "MANAGER_RENDERER"    : true,
        "MANAGER_INPUT"       : true,
        "MANAGER_POINTER_LOCK": true,
        "MANAGER_DATA_DISPLAY": true,
        "MANAGER_LOADING"     : true,
        // and their class names.
        "WorldManager"      : false,
        "AudioManager"      : false,
        "EntityManager"     : false,
        "MultiPlayerManager": false,
        "RendererManager"   : false,
        "InputManager"      : false,
        "PointerLockManager": false,
        "DataDisplay"       : false,
        "LoadingManager"    : false,

        // Global objects.
        "CURRENT_PLAYER": true,
        "ENTITY_OWNER": true,
        // and their class names.
        "EntityOwner": false,
        "Player": true,

        "PlayerMenu": true,

        // Global GUI objects.
        "GUI_PAUSED_MENU": true,
        "GUI_TYPING_INTERFACE": true,
        // and their class names.
        "PausedMenu": false,
        "TypingInterface": false,

        // Global POST calls (used for debugging).
        "GlobalPostCall": false,
        "GLOBAL_POST_PRINT_ENTITY_MANAGER_STATUS": true,

        "GLOBAL_FONT": false,

        "DragNDrop": false,

        "HALF_PIE": false,
        "PIE": false,
        "TWO_PIE": false,

        "Entity": false,
        "EntityWall": false,
        "CreateEntity": false,

        "TextSyntaxManager": true,

        // From globals.js
        "NOT_FOUND": false,

        // UNIVERSAL_CONSTANTS_START : POST URLs for client-server communication.
        "POST_URL_DELETE_ENTITY"        : false,
        "POST_URL_SAVE_ENTITY"          : false,
        "POST_URL_GET_USER_ENTITIES"    : false,
        "POST_URL_GET_PUBLIC_ENTITIES"  : false,
        "POST_URL_CREATE_ACCOUNT"       : false,
        "POST_URL_LOGIN"                : false,
        "POST_URL_ENTITY_MANAGER_STATUS": false,
        "POST_URL_GET_DATABASE_DATA"    : false,
        "POST_URL_GET_ALL_SERVER_CACHE" : false,
        "POST_URL_GET_SERVER_LOGS"      : false,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Floating text types.
        "TYPE_PASSWORD"              : false,
        "TYPE_INPUT"                 : false,
        "TYPE_ICON"                  : false,
        "TYPE_SUPER_TITLE"           : false,
        "TYPE_BUTTON"                : false,
        "TYPE_TITLE"                 : false,
        "TYPE_SUPER_TITLE_CONSTANT"  : false,
        "TYPE_CHECK_BOX"             : false,
        "TYPE_CONSTANT"              : false,
        "TYPE_SLIDER"                : false,
        "TYPE_TWO_DIRECTIONAL_SLIDER": false,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Web socket message types.
        "WEB_SOCKET_MESSAGE_TYPE_ALL_PLAYERS"                : false,
        "WEB_SOCKET_MESSAGE_TYPE_CONNECTION"                 : false,
        "WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED"               : false,
        "WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE"               : false,
        "WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE"             : false,
        "WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE"            : false,
        "WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE": false,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Entity types.
        "ENTITY_TYPE_TASK"           : false,
        "ENTITY_TYPE_TIME"           : false,
        "ENTITY_TYPE_BASE"           : false,
        "ENTITY_TYPE_WALL"           : false,
        "ENTITY_TYPE_OWNER"          : false,
        "ENTITY_TYPE_TEXT_REMINDER"  : false,
        "ENTITY_TYPE_ALL"            : false,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Entity default property keys.
        "ENTITY_DEFAULT_PROPERTY_PARENT_IDS" : false,
        "ENTITY_DEFAULT_PROPERTY_CHILD_IDS"  : false,
        "ENTITY_DEFAULT_PROPERTY_RELATIVE_ID": false,
        "ENTITY_DEFAULT_PROPERTY_TYPE"       : false,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Entity property keys.
        "ENTITY_PROPERTY_START_TOKEN"        : false,
        "ENTITY_PROPERTY_PUBLIC"             : false,
        "ENTITY_PROPERTY_OWNER"              : false,
        "ENTITY_PROPERTY_PASSWORD"           : false,
        "ENTITY_PROPERTY_USERNAME"           : false,
        "ENTITY_PROPERTY_EMAIL"              : false,
        "ENTITY_PROPERTY_NAME"               : false,
        "ENTITY_PROPERTY_POSITION"           : false,
        "ENTITY_PROPERTY_WIDTH"              : false,
        "ENTITY_PROPERTY_HEIGHT"             : false,
        "ENTITY_PROPERTY_HORIZONTAL_OFFSET"  : false,
        "ENTITY_PROPERTY_VERTICAL_OFFSET"    : false,
        "ENTITY_PROPERTY_NORMAL_DEPTH"       : false,
        "ENTITY_PROPERTY_NORMAL"             : false,
        "ENTITY_PROPERTY_COMPLETED"          : false,
        "ENTITY_PROPERTY_PHONE_NUMBER"       : false,
        "ENTITY_PROPERTY_PHONE_CARRIER"      : false,
        "ENTITY_PROPERTY_CREATED_AT_DATE"    : false,
        "ENTITY_PROPERTY_DUE_DATE"           : false,
        "ENTITY_PROPERTY_DUE_TIME"           : false,
        "ENTITY_PROPERTY_IMPORTANCE"         : false,
        "ENTITY_PROPERTY_SERVER_ID"          : false,
        "ENTITY_PROPERTY_EXECUTE_DATE"       : false,
        "ENTITY_PROPERTY_EXECUTE_TIME"       : false,
        "ENTITY_PROPERTY_TEXT_CONTENTS"      : false,
        // UNIVERSAL_CONSTANTS_END

        "SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION"  : true,
        "SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE": true,

        "ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE" : false,

        "ACCOUNT_TYPE_NOT_VERIFIED": true,
        "ACCOUNT_TYPE_INTERNAL"    : true,
        "ACCOUNT_TYPE_DEFAULT"     : true,
        "ACCOUNT_TYPE_ADMIN"       : true,
        "ACCOUNT_TYPE_SUDO"        : true,

        "AUDIO_TYPING_SOUND"  : true,

        "TEXTURE_GROUP_SKYBOX": true,
        "TEXTURE_GROUP_CURSOR": true,
        "TEXTURE_GROUP_ICONS" : true,

        // UNIVERSAL_CONSTANTS_START : Cursor types.
        "CURSOR_TYPE_HORIZONTAL": true,
        "CURSOR_TYPE_VERTICAL"  : true,
        "CURSOR_TYPE_LARGER"    : true,
        "CURSOR_TYPE_HAND"      : true,
        "CURSOR_TYPE_POINTER"   : true,
        "CURSOR_TYPE_MOUSE"     : true,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Skybox textures.
        "SKYBOX_FRONT" : true,
        "SKYBOX_BACK"  : true,
        "SKYBOX_LEFT"  : true,
        "SKYBOX_RIGHT" : true,
        "SKYBOX_TOP"   : true,
        "SKYBOX_BOTTOM": true,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Text syntax error checks.
        "TEXT_SYNTAX_STANDARD_LENGTH": true,
        "TEXT_SYNTAX_EMAIL"          : true,
        "TEXT_SYNTAX_MATCH_PASSWORDS": true,
        // UNIVERSAL_CONSTANTS_END

        "CELL_PHONE_CARRIERS": false,

        // UNIVERSAL_CONSTANTS_START : Entity POST keys.
        "ENTITY_POST_SAVE_DATA"              : false,
        // UNIVERSAL_CONSTANTS_END

        "DateSelector": true,

        "COOKIE_SHOULD_REMEMBER_USERNAME": false,
        "COOKIE_REMEMBERED_USERNAME"     : false,

        "POST_KEY_GENERIC_DATA" : true,

        "POST_USERNAME"  : false,
        "POST_PASSWORD"  : false,
        "POST_SAVE_DATA" : false,
        "POST_EMAIL"     : false,
        "POST_MANAGER_ID": false,
        "POST_OWNER_ID"  : false,

        // 3rd party hix grid reference.
        "vg": false,

        "BACKGROUND_COLOR_DEFAULT" : false,
        "BACKGROUND_COLOR_FOCUS"   : false,
        "BACKGROUND_COLOR_ERROR"   : false,
        "BACKGROUND_COLOR_SUCCESS" : false,

        // UNIVERSAL_CONSTANTS_START : Icons.
        "ICON_EXIT"         : false,
        "ICON_SETTINGS"     : false,
        "ICON_MULTI_PLAYER" : false,
        "ICON_HOME"         : false,
        "ICON_SAVE"         : false,
        "ICON_ENTITY_GROUP" : false,
        "ICON_FULLSCREEN"   : false,
        "ICON_LEFT"         : false,
        "ICON_RIGHT"        : false,
        "ICON_CROSS"        : false,
        "ICON_WORLDS"       : false,
        "ICON_LOCKED"       : false,
        "ICON_UNLOCKED"     : false,
        "ICON_WARNING"      : false,
        "ICON_TELEPORT"     : false,
        "ICON_CHECKMARK"    : false,
        "ICON_SINGLE_PLAYER": false,
        "ICON_WRENCH"       : false,
        // UNIVERSAL_CONSTANTS_END

        "TEXT_FORMAT_LEFT"        : false,
        "TEXT_FORMAT_CENTER"      : false,
        "TEXT_FORMAT_RIGHT"       : false,

        "get_color_range_list": false,

        // UNIVERSAL_CONSTANTS_START : Colors and utility indexes.
        "COLOR_STRING_INDEX"      : false,
        "COLOR_HEX_INDEX"         : false,
        "COLOR_HIGHLIGHT"         : false,
        "COLOR_PLANET"            : false,
        "COLOR_TEXT_DEFAULT"      : false,
        "COLOR_TEXT_BUTTON"       : false,
        "COLOR_RED"               : false,
        "COLOR_ORANGE"            : false,
        "COLOR_GREEN"             : false,
        "COLOR_BLUE"              : false,
        "COLOR_DARK_PURPLE"       : false,
        "COLOR_LIGHT_PURPLE"      : false,
        "COLOR_TEXT_CONSTANT"          : false,
        "COLOR_WHITE"                  : false,
        "COLOR_BLACK"                  : false,
        "COLOR_SCHEDULE_PAST"          : false,
        "COLOR_SCHEDULE_PRESENT"       : false,
        "COLOR_SCHEDULE_FUTURE"        : false,
        "COLOR_FLOATING_WALL_BASE"     : false,
        "COLOR_FLOATING_WALL_TOP"      : false,
        "COLOR_FLOATING_WALL_HIGHLIGHT": false,
        "COLOR_FLOATING_WALL_SUCCESS": false,
        "COLOR_FLOATING_WALL_ERROR": false,
        "COLOR_TRANSPARENT"            : false,
        // UNIVERSAL_CONSTANTS_END

        // Javascript constants.
        "VISIBLE"     : false,
        "NOT_VISIBLE" : false,
        "DISPLAY_SHOW": false,
        "DISPLAY_NONE": false,

        // Mouse click events.
        "MOUSE_LEFT_CLICK"  : false,
        "MOUSE_MIDDLE_CLICK": false,
        "MOUSE_RIGHT_CLICK" : false,

        // Keycodes.
        "KEY_CODE_SHIFT"     : false,
        "KEY_CODE_UP"        : false,
        "KEY_CODE_DOWN"      : false,
        "KEY_CODE_LEFT"      : false,
        "KEY_CODE_RIGHT"     : false,
        "KEY_CODE_SPACE"     : false,
        "KEY_CODE_0"         : false,
        "KEY_CODE_1"         : false,
        "KEY_CODE_2"         : false,
        "KEY_CODE_3"         : false,
        "KEY_CODE_4"         : false,
        "KEY_CODE_5"         : false,
        "KEY_CODE_6"         : false,
        "KEY_CODE_7"         : false,
        "KEY_CODE_8"         : false,
        "KEY_CODE_9"         : false,
        "KEY_CODE_A"         : false,
        "KEY_CODE_B"         : false,
        "KEY_CODE_C"         : false,
        "KEY_CODE_D"         : false,
        "KEY_CODE_E"         : false,
        "KEY_CODE_F"         : false,
        "KEY_CODE_G"         : false,
        "KEY_CODE_H"         : false,
        "KEY_CODE_I"         : false,
        "KEY_CODE_J"         : false,
        "KEY_CODE_K"         : false,
        "KEY_CODE_L"         : false,
        "KEY_CODE_M"         : false,
        "KEY_CODE_N"         : false,
        "KEY_CODE_O"         : false,
        "KEY_CODE_P"         : false,
        "KEY_CODE_Q"         : false,
        "KEY_CODE_R"         : false,
        "KEY_CODE_S"         : false,
        "KEY_CODE_T"         : false,
        "KEY_CODE_U"         : false,
        "KEY_CODE_V"         : false,
        "KEY_CODE_W"         : false,
        "KEY_CODE_X"         : false,
        "KEY_CODE_Y"         : false,
        "KEY_CODE_Z"         : false,
        "KEY_CODE_DELETE"    : false,
        "KEY_CODE_TAB"       : false,
        "KEY_CODE_ENTER"     : false,
        "KEY_CODE_CONTROL"   : false,
        "KEY_CODE_BACK_SLASH": false,

        // Math world constants.
        "DIAGONAL_PENALTY": false,
        "GROUND_NORMAL"   : false,
        "ONE_THIRD"       : false,
        "TWO_THIRDS"      : false,

        // Shortcuts.
        "l"                                  : false,
        // Python syntax imitation.
        "str"                                : false,
        "int"                                : false,
        "len"                                : false,
        // Math shortcuts.
        "pow"                                : false,
        "sin"                                : false,
        "cos"                                : false,
        "sqrt"                               : false,
        "squared"                            : false,
        "get_nearest_power_of_two_for_number": false,

        "is_entity_property"                 : false,
        "raise_exception"                    : false,
        "raise_exception_with_full_logging"  : false,
        "is_string"                          : false,
        "is_list"                            : false,
        "string_contains"                    : false,
        "is_defined"                         : false,
        "round_to_n_decimal_places"          : false,

        "is_email_valid": false,

        "get_cookie"    : false,
        "set_cookie"    : false,

        "SERVER_REPLY_INVALID_POST_DATA_ERROR"               : false,
        "SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR": false,
        "SERVER_REPLY_GENERIC_NO"                            : false,
        "SERVER_REPLY_GENERIC_YES"                           : false,
        "SERVER_REPLY_GENERIC_SERVER_ERROR"                  : false,

        // From time_abstractions.js
        "THIS_DAY"   : false,
        "THIS_MONTH" : false,

        "DELTA_YEARS" : false,
        "DELTA_DAYS"  : false,
        "DELTA_MONTHS": false,

        "MyDates": false,
        "MyDate" : false,

        "get_list_of_dates_consisting_of_this_and_next_week": false,
        "get_just_date_object_of_date_of_n_days_offset"     : false,
        "get_date_string_from_today_with_n_day_offset"      : false,
        "get_day_of_week_as_word"                           : false,
        "get_days_in_month"                                 : false,
        "get_current_month"                                 : false,
        "get_current_year"                                  : false,
        "get_all_days_in_current_month"                     : false

    }
};
