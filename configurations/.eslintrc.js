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
        "Floating2DText": true,
        "Floating2DLabelInput": true,
        "Floating3DText": true,
        "Floating3DLabelInput": true,
        "CheckBox": true,

        "EntityEditor": false,

        "SmoothStep": false,
        "SmoothStepLowerLimitZero": false,
        "Owner": true,

        "WorldManager": true,
        "LoginWorld": true,
        "HomeWorld": true,

        "Crosshair": true,
        "PostHelper": true,

        "Button3D": true,
        "AudioManager": false,
        "AUDIO_MANAGER": true,
        "WORLD_MANAGER": true,
        "GLOBAL_COOKIES": false,

        "GLOBAL_FONT": false,

        "$": false,

        // From globals.js
        "TYPE_INPUT_PASSWORD": false,
        "TYPE_INPUT_REGULAR": false,
        "TYPE_LABEL": false,
        "TYPE_BUTTON": false,
        "TYPE_STATUS": false,
        "TYPE_TITLE": false,
        "TYPE_CHECK_BOX": false,

        "COLOR_HIGHLIGHT": false,
        "COLOR_TEXT_HIGHLIGHT": false,
        "COLOR_TEXT_DEFAULT": false,

        "COOKIE_SHOULD_REMEMBER_USERNAME": false,
        "COOKIE_REMEMBERED_USERNAME": false,

        // Shortcuts.
        "l": false,

        "is_email_valid": false,
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