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

        // Shader uniforms. ------------------------------------------------------------------------
        "SHADER_UNIFORM_SPRITESHEET_COLOR"              : false,
        "SHADER_UNIFORM_SPRITESHEET_TEXTURE"            : false,
        "SHADER_UNIFORM_SPRITESHEET_OFFSET"             : false,
        "SHADER_UNIFORM_TRANSITION_NEW_SCENE"          : false,
        "SHADER_UNIFORM_TRANSITION_OLD_SCENE"          : false,
        "SHADER_UNIFORM_TRANSITION_MIX_RATIO"          : false,
        "SHADER_UNIFORM_TRANSITION_THRESHOLD"          : false,
        "SHADER_UNIFORM_TRANSITION_TEXTURE_MIX"        : false,
        "SHADER_UNIFORM_NOISE_TIME"       : false,
        "SHADER_UNIFORM_NOISE_N_INTENSITY": false,
        "SHADER_UNIFORM_NOISE_T_DIFFUSE"  : false,
        //
        "EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK": false,
        "EFLAG_NEEDS_ENGAGE_FOR_PARSING_INPUT": false,
        "EFLAG_TYPING"                        : false,
        "EFLAG_OUTLINE_GLOW"                  : false,
        "EFLAG_INTERACTIVE"                   : false,
        "EFLAG_CACHEABLE_MESH"                : false,
        "EFLAG_CACHEABLE_MATERIAL"            : false,
        "EFLAG_CACHEABLE_GEOMETERY"           : false,
        "EFLAG_IS_BASE"                       : false,
        "EFLAG_IS_ROOT"                       : false,
        "EFLAG_IS_ROW_ELEMENT"                : false,
        "EFLAG_IS_SINGLETON"                  : false,
        "EFLAG_CREATED"                       : false,
        "EFLAG_ENGABLE"                       : false,
        "EFLAG_VISIBLE"                       : false,
        "EFLAG_BEING_LOOKED_AT"               : false,
        "EFLAG_CLICKABLE"                     : false,
        "EFLAG_ENGAGED"                       : false,
        "EFLAG_UPDATE_POSITION"               : false,
        "EFLAG_UPDATE_NORMAL"                 : false,
        "EFLAG_UPDATE_CHILD"                  : false,
        "EFLAG_UPDATE_COLOR"                  : false,
        "EFLAG_FORMAT_X_START"                : false,
        "EFLAG_FORMAT_X_CENTER"               : false,
        "EFLAG_FORMAT_X_END"                  : false,
        "EFLAG_MOUSE_MOVEABLE"                : false,
        "EFLAG_MOUSE_SCALEABLE"               : false,
        "EFLAG_IN_WORLD"                      : false,
        "EFLAG_IN_ELEMENTS_ROOT"              : false,
        "EFLAG_IN_ELEMENTS_INTERACTIVE"       : false,
        "EFLAG_IN_ELEMENTS_SINGLETON"         : false,
        "ELEMENT_EVENT_ON_LOOK_AT"            : false,
        "ELEMENT_EVENT_ON_LOOK_AWAY"          : false,
        "ELEMENT_EVENT_ON_ENGAGE"             : false,
        "ELEMENT_EVENT_ON_DISENGAGE"          : false,
        "ELEMENT_EVENT_ON_WORLD_ENTER"        : false,
        "ELEMENT_EVENT_ON_WORLD_EXIT"         : false,
        "ELEMENT_EVENT_ON_FOREGROUND_COLOR"   : false,
        "ELEMENT_EVENT_ON_BACKGROUND_COLOR"   : false,
        "ELEMENT_EVENT_ON_SET_TO_BUTTON"      : false,
        "ELEMENT_EVENT_ON_MESH_CREATED"       : false,
        "ELEMENT_EVENT_ON_NODE_UPDATE"        : false,
        "ELEMENT_EVENT_ON_SET_TO_INTERACTIVE" : false,
        //

        //
        "CLICK_LEFT"      : false,
        "CLICK_MIDDLE"    : false,
        "CLICK_RIGHT"     : false,

        //
        "GLOBAL_ID_PAUSED_BACKGROUND_FILTER"    : false,
        "GLOBAL_ID_PAUSE_DISPLAY"               : false,
        "GLOBAL_ID_SUB_PAUSED_DISPLAY_TITLE"    : false,
        "GLOBAL_ID_SUB_PAUSED_DISPLAY_SUB_TITLE": false,
        "GLOBAL_ID_CURSOR_CENTER"               : false,
        "GLOBAL_ID_CURSOR_DEFAULT"              : false,
        "GLOBAL_ID_CURSOR_ICON"                 : false,
        "GLOBAL_ID_CANVAS_MAIN"                 : false,
        "GLOBAL_ID_HUD_DEBUG"                   : false,
        "GLOBAL_ID_HUD_TYPING"                  : false,
        "GLOBAL_ID_HUD_CHAT"                    : false,
        "GLOBAL_ID_DATE_TIME"                   : false,
        //

        //
        "TEXT_ALIGNMENT_START" : false,
        "TEXT_ALIGNMENT_CENTER": false,
        "TEXT_ALIGNMENT_END"   : false,

        //

        //
        "USER_DATA_KEY_PARENT_OBJECT": false,
        "IS_CURRENTLY_LOOKED_AT"     : false,

        "FEATURE_GEOMETRY_TYPE_PLANE"  : false,
        "FEATURE_GEOMETRY_TYPE_TEXT_3D": false,
        "FEATURE_MATERIAL_TYPE_TEXT_3D": false,
        "FEATURE_MATERIAL_TYPE_ICON"   : false,
        "FEATURE_MATERIAL_CANVAS_BASIC": false,
        "FEATURE_MATERIAL_CANVAS_FANCY": false,
        "FEATURE_MATERIAL_CANVAS_SHINY": false,
        "FEATURE_MATERIAL_COLOR_FANCY" : false,
        "FEATURE_MESH_TYPE_DEFAULT"    : false,

        // From refactorings.
        "$_QE": false,
        "$_NL": false,
        "QE"  : false,
        "NL"  : false,

        "get_horizontal_distance": false,

        "APPLICATION_NEXUS_LOCAL"  : false,
        "APPLICATION_QUASAR_PUBLIC": false,

        "DOM_ELEMENT_CANVAS": false,
        "DOM_ELEMENT_DIV"   : false,
        "DOM_ELEMENT_H1"    : false,
        "DOM_ELEMENT_H2"    : false,
        "DOM_ELEMENT_H3"    : false,
        "DOM_ELEMENT_H4"    : false,
        "DOM_ELEMENT_H5"    : false,

        "DOM_ELEMENT_INSTANCE_EXISTS"     : false,
        "DOM_ELEMENT_INSTANCE_DNE"        : false,
        "DOM_ELEMENT_INSTANCE_PROVIDED"   : false,

        "THREE": false,

        "console": false,

        "EMOJI_ERROR"   : false,
        "EMOJI_SLEEPING": false,
        "EMOJI_NERD"    : false,


        "ASSET_ICON_CALENDAR"   : false,
        "ASSET_ICON_CROSS"      : false,
        "ASSET_ICON_CURSOR"     : false,
        "ASSET_ICON_DELETE"     : false,
        "ASSET_ICON_DISABLED"   : false,
        "ASSET_ICON_EXPAND"     : false,
        "ASSET_ICON_PICTURE"    : false,
        "ASSET_ICON_TELEPORT"   : false,
        "ASSET_ICON_TEXT"       : false,
        "ASSET_ICON_WRENCH"     : false,
        "ASSET_ICON_WRITTING"   : false,
        "ASSET_ICON_EXIT"       : false,
        "ASSET_ICON_HOME"       : false,
        "ASSET_ICON_CLICK"      : false,
        "ASSET_ICON_ADMIN"      : false,
        "ASSET_ICON_LOCKED"     : false,
        "ASSET_ICON_UNLOCKED"   : false,
        "ASSET_ICON_ARROW"      : false,
        "ASSET_ICON_HORIZONTAL" : false,
        "ASSET_ICON_VERTICAL"   : false,
        "ASSET_ICON_WARNING"    : false,
        "ASSET_ICON_VIDEO"      : false,
        "ASSET_ICON_QUESTION"   : false,
        "ASSET_ICON_CHECKMARK"  : false,
        "ASSET_ICON_DRAG"       : false,
        "ASSET_ICON_GEARS"      : false,
        "ASSET_ICON_FOLDER"     : false,
        "ASSET_ICON_TERMINAL"   : false,
        "ASSET_ICON_PLANET"     : false,


        "ASSET_TYPE_TEXTURE"                : false,
        "ASSET_TYPE_SHADER_MATERIAL"        : false,
        "ASSET_TEXTURE_SPRITE_SHEET"        : false,
        "ASSET_TEXTURE_TRANSITION"          : false,
        "ASSET_SHADER_MATERIAL_TRANSITION"  : false,
        "ASSET_SHADER_MATERIAL_NOISE"       : false,
        "ASSET_SHADER_MATERIAL_SPRITE_SHEET": false,

        "CLIENT_FEATURE_CANVAS"      : false,
        "CLIENT_FEATURE_WEBGL"       : false,
        "CLIENT_FEATURE_WEB_WORKERS" : false,
        "CLIENT_FEATURE_MOBILE"      : false,
        "CLIENT_FEATURE_VR"          : false,
        "CLIENT_FEATURE_FULL_SCREEN" : false,
        "CLIENT_FEATURE_POINTER_LOCK": false,

        // OLD BELOW.

        "OutlineGlow": false,
        "FilmNoise"  : false,

        //       ___  __      __   __   __        ___ ___  __    /  __   ___  __        ___  __            ___  __   __        __   ___  __
        // |  | |__  |__)    /__` /  \ /  ` |__/ |__   |  /__`  /  /__` |__  |__) \  / |__  |__)     |\/| |__  /__` /__`  /\  / _` |__  /__`
        // |/\| |___ |__)    .__/ \__/ \__, |  \ |___  |  .__/ /   .__/ |___ |  \  \/  |___ |  \     |  | |___ .__/ .__/ /~~\ \__> |___ .__/
        "_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE": false,
        "_WEB_SOCKET_REQUEST_KEY_MESSAGE_ID"  : false,
        "_WEB_SOCKET_REQUEST_KEY_USERNAME"    : false,
        "_WEB_SOCKET_REQUEST_KEY_PASSWORD"    : false,
        "_WEB_SOCKET_REQUEST_KEY_EMAIL"       : false,
        "_WEB_SOCKET_REQUEST_KEY_SAVE_DATA"   : false,
        "_WEB_SOCKET_REQUEST_KEY_DELETED_IDS" : false,

        "_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN"          : false,
        "_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT" : false,
        "_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOAD_USER_DATA" : false,
        "_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGOUT"         : false,
        "_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_SAVE_DATA"      : false,
        "_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CHAT_MESSAGE"   : false,
        "_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_DELETE_ENTITIES": false,

        //  __        __   __                                     __   ___  __   __
        // / _` |    /  \ |__)  /\  |        |\/|  /\  |\ |  /\  / _` |__  |__) /__`
        // \__> |___ \__/ |__) /~~\ |___     |  | /~~\ | \| /~~\ \__> |___ |  \ .__/

        "CENTER_ABSOLUTE": false,

        "TypingInterface": false,

        "GLOBAL_FONT": false,

        "DragNDrop": false,

        "Entity": false,

        "NO_SAVE_DATA"   : false,
        "SAVE_TAG_3D_ROW": false,
        "SAVE_TAG_2D_ROW": false,

        "TextSyntaxManager": true,

        // From globals.js
        "NOT_FOUND": false,

        "ENTITY_STATIC_WORLD_HOME"    : false,
        "ENTITY_STATIC_WORLD_SETTINGS": false,
        "ENTITY_STATIC_WORLD_ADMIN"   : false,

        "PLAYER_STATE_FULL_CONTROL" : false,
        "PLAYER_STATE_PAUSED"       : false,
        "PLAYER_STATE_ENGAGED"      : false,
        "PLAYER_STATE_TYPING_IN_HUD": false,

        "POST_KEY_GENERIC_DATA"                       : true,
        "SERVER_COMMAND_SUDO_OPERATION"               : true,
        "SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE": true,
        "SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION" : true,
        "SERVER_COMMAND_DELETE_ENTITY_OWNER"          : true,

        // UNIVERSAL_CONSTANTS_START : Entity types.
        "ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER": false,
        "ENTITY_TYPE_STATIC_WORLDS_MANAGER" : false,
        "ENTITY_TYPE_DYNAMIC_WORLD"         : false,
        "ENTITY_TYPE_STATIC_WORLD"          : false,
        "ENTITY_TYPE_TASK"                  : false,
        "ENTITY_TYPE_BASE"                  : false,
        "ENTITY_TYPE_WALL"                  : false,
        "ENTITY_TYPE_ENTITY_GROUP"          : false,
        "ENTITY_TYPE_OWNER"                 : false,
        "ENTITY_TYPE_TEXT_REMINDER"         : false,
        "ENTITY_TYPE_PICTURE"               : false,
        "ENTITY_TYPE_VIDEO"                 : false,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Entity default property keys.
        "ENTITY_DEFAULT_PROPERTY_PARENT_IDS" : false,
        "ENTITY_DEFAULT_PROPERTY_CHILD_IDS"  : false,
        "ENTITY_DEFAULT_PROPERTY_RELATIVE_ID": false,
        "ENTITY_DEFAULT_PROPERTY_TYPE"       : false,
        // UNIVERSAL_CONSTANTS_END

        // UNIVERSAL_CONSTANTS_START : Entity property keys.
        "ENTITY_PROPERTY_START_TOKEN"        : false,
        "ENTITY_PROPERTY_OWNER"              : false,
        "ENTITY_PROPERTY_PASSWORD"           : false,
        "ENTITY_PROPERTY_USERNAME"           : false,
        "ENTITY_PROPERTY_EMAIL"              : false,
        "ENTITY_PROPERTY_NAME"               : false,
        "ENTITY_PROPERTY_POSITION"           : false,
        "ENTITY_PROPERTY_WIDTH"              : false,
        "ENTITY_PROPERTY_HEIGHT"             : false,
        "ENTITY_PROPERTY_NORMAL"             : false,
        "ENTITY_PROPERTY_COMPLETED"          : false,
        "ENTITY_PROPERTY_PHONE_NUMBER"       : false,
        "ENTITY_PROPERTY_PHONE_CARRIER"      : false,
        "ENTITY_PROPERTY_IMPORTANCE"         : false,
        "ENTITY_PROPERTY_EXECUTE_DATE"       : false,
        "ENTITY_PROPERTY_EXECUTE_TIME"       : false,
        "ENTITY_PROPERTY_TEXT_CONTENTS"      : false,
        "ENTITY_PROPERTY_IMAGE_DATA"         : false,
        "ENTITY_PROPERTY_IS_ROOT_ATTACHABLE" : false,
        "ENTITY_PROPERTY_3D_ROWS"            : false,
        "ENTITY_PROPERTY_2D_ROWS"            : false,
        "ENTITY_PROPERTY_TAGS"               : false,
        "ENTITY_PROPERTY_NOTE"               : false,
        "ENTITY_PROPERTY_CREATED_AT_DATE"    : false,
        "ENTITY_PROPERTY_GROUP_NAME"         : false,
        "ENTITY_PROPERTY_START_DATE_TIME"    : false,
        "ENTITY_PROPERTY_END_DATE_TIME"      : false,
        "ENTITY_PROPERTY_TIME_DURATION"      : false,
        "ENTITY_PROPERTY_TIME_NEEDED"        : false,
        // UNIVERSAL_CONSTANTS_END

        // Entity property values.
        "ENTITY_PROPERTY_COMPLETED_VALUE_NO" : false,
        "ENTITY_PROPERTY_COMPLETED_VALUE_YES": false,

        "ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE" : false,

        "ACCOUNT_TYPE_NOT_VERIFIED": true,
        "ACCOUNT_TYPE_INTERNAL"    : true,
        "ACCOUNT_TYPE_DEFAULT"     : true,
        "ACCOUNT_TYPE_ADMIN"       : true,
        "ACCOUNT_TYPE_SUDO"        : true,

        //       __   __   ___ ___  __
        //  /\  /__` /__` |__   |  /__`
        // /~~\ .__/ .__/ |___  |  .__/

        // Shaders.
        "SHADER_TRANSITION_FRAGMENT": false,
        "SHADER_TRANSITION_VERTEX"  : false,
        "SHADER_NOISE_FRAGMENT"     : false,
        "SHADER_NOISE_VERTEX"       : false,
        "SHADER_MATERIAL_TRANSITION": false,
        "SHADER_MATERIAL_NOISE"     : false,

        // Audio.
        "AUDIO_SOUND_TYPING"      : false,
        "AUDIO_SOUND_TRANSITION"  : false,
        "AUDIO_SOUND_ERROR"       : false,
        "AUDIO_SOUND_ON_DISENGAGE": false,
        "AUDIO_SOUND_ON_ENGAGE"   : false,
        "AUDIO_SOUND_ON_HOVER"    : false,
        "AUDIO_SOUND_SUCCESS"     : false,
        "AUDIO_SOUND_CHECKBOX"    : false,
        "AUDIO_MUSIC_BACKGROUND"  : false,

        // Textures.
        "ASSET_GROUP_AUDIO"  : false,
        "ASSET_GROUP_TEXTURE": false,

        "TRANSITION_GRID": true,

        "SKYBOX_FRONT" : true,
        "SKYBOX_BACK"  : true,
        "SKYBOX_LEFT"  : true,
        "SKYBOX_RIGHT" : true,
        "SKYBOX_TOP"   : true,
        "SKYBOX_BOTTOM": true,

        "SPRITESHEET_ICONS": false,


        "CELL_PHONE_CARRIERS": false,

        // 3rd party hix grid reference.
        "vg": false,

        "get_color_range_list": false,

        // UNIVERSAL_CONSTANTS_START : Colors and utility indexes.

        "FLOATING_TEXT_BACKGROUND_DARK_GRAY"  : false,
        "FLOATING_TEXT_BACKGROUND_TRANSPARENT": false,
        "FLOATING_TEXT_BACKGROUND_DEFAULT"    : false,
        "FLOATING_TEXT_BACKGROUND_ERROR"      : false,
        "FLOATING_TEXT_BACKGROUND_SUCCESS"    : false,
        "COLOR_CANVAS_GREEN"                  : false,
        "COLOR_CANVAS_TEAL"                   : false,
        "COLOR_CANVAS_YELLOW"                 : false,
        "COLOR_CANVAS_GRAY"                   : false,

        // Keycodes.
        "KEY_CODE__SHIFT"     : false,
        "KEY_CODE__UP"        : false,
        "KEY_CODE__DOWN"      : false,
        "KEY_CODE__LEFT"      : false,
        "KEY_CODE__RIGHT"     : false,
        "KEY_CODE__SPACE"     : false,
        "KEY_CODE_0"          : false,
        "KEY_CODE_1"          : false,
        "KEY_CODE_2"          : false,
        "KEY_CODE_3"          : false,
        "KEY_CODE_4"          : false,
        "KEY_CODE_5"          : false,
        "KEY_CODE_6"          : false,
        "KEY_CODE_7"          : false,
        "KEY_CODE_8"          : false,
        "KEY_CODE_9"          : false,
        "KEY_CODE_A"          : false,
        "KEY_CODE_B"          : false,
        "KEY_CODE_C"          : false,
        "KEY_CODE_D"          : false,
        "KEY_CODE_E"          : false,
        "KEY_CODE_F"          : false,
        "KEY_CODE_G"          : false,
        "KEY_CODE_H"          : false,
        "KEY_CODE_I"          : false,
        "KEY_CODE_J"          : false,
        "KEY_CODE_K"          : false,
        "KEY_CODE_L"          : false,
        "KEY_CODE_M"          : false,
        "KEY_CODE_N"          : false,
        "KEY_CODE_O"          : false,
        "KEY_CODE_P"          : false,
        "KEY_CODE_Q"          : false,
        "KEY_CODE_R"          : false,
        "KEY_CODE_S"          : false,
        "KEY_CODE_T"          : false,
        "KEY_CODE_U"          : false,
        "KEY_CODE_V"          : false,
        "KEY_CODE_W"          : false,
        "KEY_CODE_X"          : false,
        "KEY_CODE_Y"          : false,
        "KEY_CODE_Z"          : false,
        "KEY_CODE__DELETE"    : false,
        "KEY_CODE__TAB"       : false,
        "KEY_CODE__ENTER"     : false,
        "KEY_CODE__CONTROL"   : false,
        "KEY_CODE__BACK_SLASH": false,

        // Shortcuts.
        "l"                                  : false,
        // Python syntax imitation.
        "str"                                : false,
        "int"                                : false,

        "is_string"                          : false,


        // ___          ___          __   __  ___  __        __  ___    __        __  
        //  |  |  |\/| |__      /\  |__) /__`  |  |__)  /\  /  `  |  | /  \ |\ | /__` 
        //  |  |  |  | |___    /~~\ |__) .__/  |  |  \ /~~\ \__,  |  | \__/ | \| .__/

        ///// Organize this portion.
        "DateSelector": true,
        "TimeSelector": true,

        "ScheduleView": true,
        "DayView"     : true,
        "MonthView"   : true,

        "MonthInstance": false,
        "DayInstance"  : false,
        /////

        "DayViewSimple": false,
        "DayViewFull"  : false,

        "MonthIdentifier": false,
        "YearIdentifier" : false,

        "ENTITY_TYPE_MONTH_VIEW_WALL": false,
        "ENTITY_PROPERTY_MONTH_TYPE" : false,
        "ENTITY_PROPERTY_YEAR_TYPE"  : false,

        "TIME_DELTA_YEARS" : false,
        "TIME_DELTA_DAYS"  : false,
        "TIME_DELTA_MONTHS": false,

        "TIME_TYPE_YEAR_CURRENT" : false,
        "TIME_TYPE_YEAR_STATIC"  : false,
        "TIME_TYPE_MONTH_CURRENT": false,
        "TIME_TYPE_MONTH_STATIC" : false,
        "TIME_TYPE_DAY_CURRENT"  : false,
        "TIME_TYPE_DAY_STATIC"   : false,

        "MONTH_JANUARY"  : false,
        "MONTH_FEBRUARY" : false,
        "MONTH_MARCH"    : false,
        "MONTH_APRIL"    : false,
        "MONTH_MAY"      : false,
        "MONTH_JUNE"     : false,
        "MONTH_JULY"     : false,
        "MONTH_AUGUST"   : false,
        "MONTH_SEPTEMBER": false,
        "MONTH_OCTOBER"  : false,
        "MONTH_NOVEMBER" : false,
        "MONTH_DECEMBER" : false,

        "MONTH_JANUARY_STRING"  : false,
        "MONTH_FEBRUARY_STRING" : false,
        "MONTH_MARCH_STRING"    : false,
        "MONTH_APRIL_STRING"    : false,
        "MONTH_MAY_STRING"      : false,
        "MONTH_JUNE_STRING"     : false,
        "MONTH_JULY_STRING"     : false,
        "MONTH_AUGUST_STRING"   : false,
        "MONTH_SEPTEMBER_STRING": false,
        "MONTH_OCTOBER_STRING"  : false,
        "MONTH_NOVEMBER_STRING" : false,
        "MONTH_DECEMBER_STRING" : false,

        "DAY_MONDAY"   : false,
        "DAY_TUESDAY"  : false,
        "DAY_WEDNESDAY": false,
        "DAY_THURSDAY" : false,
        "DAY_FRIDAY"   : false,
        "DAY_SATURDAY" : false,
        "DAY_SUNDAY"   : false,

        "DAY_MONDAY_STRING"   : false,
        "DAY_TUESDAY_STRING"  : false,
        "DAY_WEDNESDAY_STRING": false,
        "DAY_THURSDAY_STRING" : false,
        "DAY_FRIDAY_STRING"   : false,
        "DAY_SATURDAY_STRING" : false,
        "DAY_SUNDAY_STRING"   : false,

        "MONTH_NAMES": false,
        "DAY_NAMES"  : false,
        "get_month_number_from_string": false,
        "get_day_number_from_string"  : false,
        "get_month_string_from_number": false,
        "get_day_string_from_number"  : false,
        "get_current_month_number"    : false,
        "get_current_year_number"     : false,
        "get_days_in_month"           : false,

        //           ___
        // |\/|  /\   |  |__|
        // |  | /~~\  |  |  |

        "get_player_blink_spot": false,

        "get_parametric_line_equation"           : false,
        "get_parametric_plane_equation"          : false,
        "is_point_inside_floating_wall"          : false,
        "get_line_intersection_on_infinite_plane": false,

        // Utility constants.
        "GROUND_NORMAL"   : false,
        "ONE_THIRD"       : false,
        "ONE_FOURTH"      : false,
        "THREE_FOURTHS"   : false,
        "TWO_THIRDS"      : false,
        "HALF"            : false,
        "PIE"             : false,

        // World constants.
        // none needed for now

        // Utility functions and shortcuts.
        "pow"                                : false,
        "sin"                                : false,
        "cos"                                : false,
        "sqrt"                               : false,
        "squared"                            : false,
        "get_nearest_power_of_two_for_number": false,
        "round_to_n_decimal_places"          : false,
    }
};
