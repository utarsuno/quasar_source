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
        "LoginWorld": true,
        "Crosshair": true,

        "TYPE_INPUT_PASSWORD": false,
        "TYPE_INPUT_REGULAR": false,
        "TYPE_LABEL": false,
        "TYPE_BUTTON": false,
        "TYPE_STATUS": false,
        "TYPE_TITLE": false,

        "HIGHLIGHT_COLOR": false,
        "TEXT_COLOR": false
    }
};