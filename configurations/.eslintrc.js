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
            "never"
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

        "InteractiveWall": true,
        "Floating2DText": true,
        "Floating2DLabelInput": true,
        "Floating3DText": true,
        "Floating3DLabelInput": true,
        "CheckBox": true,

        "EntityTaskCreator": false,
        "EntityEditor": false,

        "SmoothStep": false,
        "SmoothStepLowerLimitZero": false,
        "Owner": true,

        "WorldManager": true,
        "LoginWorld": true,
        "HomeWorld": true,

        "Crosshair": true,
        "PostHelper": true,

        "Interactive": true,
        "Button3D": true,
        "AudioManager": false,
        "AUDIO_MANAGER": true,
        "WORLD_MANAGER": true,
        "ENTITY_MANAGER": false,
        "EntityManager": true,
        "GLOBAL_COOKIES": false,

        "GLOBAL_FONT": false,

        "HALF_PIE": false,
        "PIE": false,
        "TWO_PIE": false,

        "$": false,

        "EntityWall": false,

        // From globals.js
        "TYPE_INPUT_PASSWORD": false,
        "TYPE_INPUT_REGULAR": false,
        "TYPE_LABEL": false,
        "TYPE_BUTTON": false,
        "TYPE_STATUS": false,
        "TYPE_TITLE": false,
        "TYPE_CHECK_BOX": false,

        "ENTITY_TYPE_TASK": false,
        "ENTITY_TYPE_TIME": false,
        "ENTITY_TYPE_BASE": false,

        "COLOR_HIGHLIGHT": false,
        "COLOR_TEXT_HIGHLIGHT": false,
        "COLOR_TEXT_DEFAULT": false,

        "COOKIE_SHOULD_REMEMBER_USERNAME": false,
        "COOKIE_REMEMBERED_USERNAME": false,

        // Keycodes.
        "KEY_CODE_SHIFT": false,
        "KEY_CODE_UP": false,
        "KEY_CODE_DOWN": false,
        "KEY_CODE_LEFT": false,
        "KEY_CODE_RIGHT": false,
        "KEY_CODE_SPACE": false,
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