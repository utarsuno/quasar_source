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
        "RendererAPI": true,
        "CSSRendererAPI": true,
        "FPSControls": true,
        "ShaderAPI": true,
        "DataDisplay": true,
        "CUSTOM_COLORS": true,
        "Client": true,
        "World": true,
        "PlaneAPI": true,
        "LoginPanel": true,
        "Player": true,
        "WebSocketClient": false,

        "FloatingWall": true,
        "Floating2DText": true,
        "Floating2DLabelInput": true,
        "Floating3DText": true,
        "Floating3DLabelInput": true,
        "FloatingSlider": true,
        "CheckBox": true,

        // Core
        "InputTextProcessor": false,
        "CustomSmoothStep": false,

        "Owner": true,

        "LoginWorld": true,
        "HomeWorld": true,
        "SettingsWorld": true,

        "Crosshair": true,
        "PostHelper": true,

        "Interactive": true,
        "Visibility": true,
        "Button3D": true,
        "DomElement": false,

        // Global Managers.
        "MANAGER_COOKIES": true,
        "MANAGER_AUDIO"      : true,
        "MANAGER_WORLD"      : true,
        "MANAGER_ENTITY"     : true,
        "MANAGER_MULTIPLAYER": true,
        // and their class names.
        "WorldManager"      : true,
        "AudioManager"      : false,
        "EntityManager"     : true,
        "MultiPlayerManager": false,

        // Global GUI objects.
        "GUI_PAUSED_MENU": true,
        "GUI_TYPING_INTERFACE": true,
        // and their class names.
        "PausedMenu": false,
        "TypingInterface": false,

        "GLOBAL_FONT": false,

        "HALF_PIE": false,
        "PIE": false,
        "TWO_PIE": false,

        "$": false,

        "Entity": false,
        "EntityWall": false,
        "CreateEntity": false,

        // From globals.js
        "NOT_FOUND": false,

        "TYPE_INPUT_PASSWORD": false,
        "TYPE_INPUT_REGULAR": false,
        "TYPE_SUPER_TITLE": false,
        "TYPE_LABEL": false,
        "TYPE_BUTTON": false,
        "TYPE_STATUS": false,
        "TYPE_TITLE": false,
        "TYPE_CHECK_BOX": false,
        "TYPE_CONSTANT_TEXT": false,
        "TYPE_SLIDER": false,

        // Web socket message types.
        "WEB_SOCKET_MESSAGE_TYPE_ALL_PLAYERS"                : false,
        "WEB_SOCKET_MESSAGE_TYPE_CONNECTION"                 : false,
        "WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED"               : false,
        "WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE"               : false,
        "WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE"             : false,
        "WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE"            : false,
        "WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE": false,

        "ENTITY_TYPE_TASK"           : false,
        "ENTITY_TYPE_TIME"           : false,
        "ENTITY_TYPE_BASE"           : false,
        "ENTITY_TYPE_WALL"           : false,
        "ENTITY_TYPE_OWNER"          : false,
        "ENTITY_TYPE_TEXT_REMINDER"  : false,
        "ENTITY_TYPE_NO_SPECIAL_TYPE": false,
        "ENTITY_TYPE_ALL"            : false,

        "ENTITY_PROPERTY_ID"       : false,
        "ENTITY_PROPERTY_TYPE"     : false,
        "ENTITY_PROPERTY_POSITION" : false,
        "ENTITY_PROPERTY_LOOK_AT"  : false,
        "ENTITY_PROPERTY_NAME"     : false,
        "ENTITY_PROPERTY_PARENTS"  : false,
        "ENTITY_PROPERTY_CHILDREN" : false,
        "ENTITY_PROPERTY_COMPLETED": false,
        "ENTITY_PROPERTY_ALL"      : false,

        "COLOR_HIGHLIGHT"     : false,
        "COLOR_TEXT_HIGHLIGHT": false,
        "COLOR_TEXT_PLANET"   : false,
        "COLOR_TEXT_CONSTANT" : false,
        "COLOR_TEXT_DEFAULT"  : false,
        "COLOR_TEXT_RED"      : false,
        "COLOR_TEXT_GREEN"    : false,
        "COLOR_TEXT_BUTTON"   : false,
        "COLOR_HEX_BLACK"     : false,
        "COLOR_BLACK"         : false,

        "COOKIE_SHOULD_REMEMBER_USERNAME": false,
        "COOKIE_REMEMBERED_USERNAME": false,

        "POST_USERNAME": false,
        "POST_PASSWORD": false,
        "POST_SAVE_DATA": false,
        "POST_EMAIL": false,
        "POST_MANAGER_ID": false,
        "POST_OWNER_ID": false,

        // 3rd party hix grid reference.
        "vg": false,

        // Javascript constants.
        "VISIBLE": false,
        "NOT_VISIBLE": false,
        "DISPLAY_SHOW": false,
        "DISPLAY_NONE": false,

        // Mouse click events.
        "MOUSE_LEFT_CLICK": false,
        "MOUSE_MIDDLE_CLICK": false,
        "MOUSE_RIGHT_CLICK": false,

        // Keycodes.
        "KEY_CODE_SHIFT": false,
        "KEY_CODE_UP": false,
        "KEY_CODE_DOWN": false,
        "KEY_CODE_LEFT": false,
        "KEY_CODE_RIGHT": false,
        "KEY_CODE_SPACE": false,
        "KEY_CODE_0": false,
        "KEY_CODE_1": false,
        "KEY_CODE_2": false,
        "KEY_CODE_3": false,
        "KEY_CODE_4": false,
        "KEY_CODE_5": false,
        "KEY_CODE_6": false,
        "KEY_CODE_7": false,
        "KEY_CODE_8": false,
        "KEY_CODE_9": false,
        "KEY_CODE_A": false,
        "KEY_CODE_B": false,
        "KEY_CODE_C": false,
        "KEY_CODE_D": false,
        "KEY_CODE_E": false,
        "KEY_CODE_F": false,
        "KEY_CODE_G": false,
        "KEY_CODE_H": false,
        "KEY_CODE_I": false,
        "KEY_CODE_J": false,
        "KEY_CODE_K": false,
        "KEY_CODE_L": false,
        "KEY_CODE_M": false,
        "KEY_CODE_N": false,
        "KEY_CODE_O": false,
        "KEY_CODE_P": false,
        "KEY_CODE_Q": false,
        "KEY_CODE_R": false,
        "KEY_CODE_S": false,
        "KEY_CODE_T": false,
        "KEY_CODE_U": false,
        "KEY_CODE_V": false,
        "KEY_CODE_W": false,
        "KEY_CODE_X": false,
        "KEY_CODE_Y": false,
        "KEY_CODE_Z": false,
        "KEY_CODE_DELETE": false,
        "KEY_CODE_TAB": false,
        "KEY_CODE_ENTER": false,
        "KEY_CODE_CONTROL": false,
        "KEY_CODE_BACK_SLASH": false,

        // Shortcuts.
        "l": false,
        "is_defined": false,
        "round_to_n_decimal_places": false,

        "is_email_valid": false,
        "get_key_value_list_from_json_dictionary": false,

        "get_cookie"    : false,
        "set_cookie"    : false,

        "SERVER_REPLY_INVALID_POST_DATA_ERROR": false,
        "SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR": false,
        "SERVER_REPLY_GENERIC_NO": false,
        "SERVER_REPLY_GENERIC_YES": false,
        "SERVER_REPLY_GENERIC_SERVER_ERROR": false,

        // From time_abstractions.js
        "get_list_of_dates_consisting_of_this_and_next_week": false
    }
};