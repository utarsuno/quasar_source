# coding=utf-8

"""Temporary file, its logic will help stem the base for the refactored version."""


RAW_DATA = '''

# From texture_manager.js
const TEXTURE_GROUP_SKYBOX = 'skybox';
const TEXTURE_GROUP_CURSOR = 'cursors';
const TEXTURE_GROUP_ICONS  = 'icons';

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

const SKYBOX_FRONT  = 'skybox_front.jpg';
const SKYBOX_BACK   = 'skybox_back.jpg';
const SKYBOX_LEFT   = 'skybox_left.jpg';
const SKYBOX_RIGHT  = 'skybox_right.jpg';
const SKYBOX_TOP    = 'skybox_top.jpg';
const SKYBOX_BOTTOM = 'skybox_bottom.jpg';

const CURSOR_TYPE_HORIZONTAL = 'scroll_horizontal.png';
const CURSOR_TYPE_VERTICAL   = 'scroll_vertical.png';
const CURSOR_TYPE_LARGER     = 'larger.png';
const CURSOR_TYPE_HAND       = 'cursor_hand.png';
const CURSOR_TYPE_POINTER    = 'cursor_pointer.png';
const CURSOR_TYPE_MOUSE      = 'mouse.png';

# From input_manager.js
const EVENT_MOUSE_DOWN = 'mousedown';
const EVENT_MOUSE_UP   = 'mouseup';
const EVENT_KEY_DOWN   = 'keydown';
const EVENT_KEY_UP     = 'keyup';
const EVENT_MOUSE_MOVE = 'mousemove';
const EVENT_PASTE      = 'paste';
const EVENT_WHEEL_V0   = 'wheel';
const EVENT_WHEEL_V1   = 'mousewheel';
const EVENT_WHEEL_V2   = 'DOMMouseScroll';

# From mobile_inputs.js
const TOUCH_EVENT_START  = 'touchstart';
const TOUCH_EVENT_END    = 'touchend';
const TOUCH_EVENT_CANCEL = 'touchcancel';
const TOUCH_EVENT_MOVE   = 'touchmove';

# From cookie_manager.js
const COOKIE_SHOULD_REMEMBER_USERNAME = 'should_remember_username';
const COOKIE_REMEMBERED_USERNAME      = 'remembered_username';

# From all_entity_property_files
const ENTITY_TYPE_BASE                   = 'Entity';

const ENTITY_PROPERTY_START_TOKEN         = 'ep_';
const ENTITY_PROPERTY_NAME                = ENTITY_PROPERTY_START_TOKEN + 'name';
const ENTITY_PROPERTY_CREATED_AT_DATE     = ENTITY_PROPERTY_START_TOKEN + 'created_at_date';

const ENTITY_DEFAULT_PROPERTY_TYPE        = ENTITY_PROPERTY_START_TOKEN + 'type';
const ENTITY_DEFAULT_PROPERTY_CHILD_IDS   = ENTITY_PROPERTY_START_TOKEN + 'child_ids';
const ENTITY_DEFAULT_PROPERTY_PARENT_IDS  = ENTITY_PROPERTY_START_TOKEN + 'parent_ids';
const ENTITY_DEFAULT_PROPERTY_RELATIVE_ID = ENTITY_PROPERTY_START_TOKEN + 'relative_id';

// TODO : Move this.
const ENTITY_PROPERTY_OWNER               = ENTITY_PROPERTY_START_TOKEN + 'owner';
// Entity types.
const ENTITY_TYPE_TASK = 'EntityTask';

// Entity properties.
const ENTITY_PROPERTY_START_DATE_TIME = ENTITY_PROPERTY_START_TOKEN + 'start_date_time';
const ENTITY_PROPERTY_END_DATE_TIME   = ENTITY_PROPERTY_START_TOKEN + 'end_date_time';
const ENTITY_PROPERTY_TIME_DURATION   = ENTITY_PROPERTY_START_TOKEN + 'time_duration';
const ENTITY_PROPERTY_TIME_NEEDED     = ENTITY_PROPERTY_START_TOKEN + 'time_needed';
const ENTITY_PROPERTY_GROUP_NAME      = ENTITY_PROPERTY_START_TOKEN + 'group_name';
const ENTITY_PROPERTY_IMPORTANCE      = ENTITY_PROPERTY_START_TOKEN + 'importance';
const ENTITY_PROPERTY_NOTE            = ENTITY_PROPERTY_START_TOKEN + 'note';
const ENTITY_PROPERTY_TAGS            = ENTITY_PROPERTY_START_TOKEN + 'tags';

// Property + associated values.
const ENTITY_PROPERTY_COMPLETED           = ENTITY_PROPERTY_START_TOKEN + 'completed';
const ENTITY_PROPERTY_COMPLETED_VALUE_NO  = 'no';
const ENTITY_PROPERTY_COMPLETED_VALUE_YES = 'yes';

const ENTITY_TYPE_ENTITY_GROUP = 'EntityGroup';

// Entity types.
const ENTITY_TYPE_OWNER = 'EntityOwner';

// Entity properties.
const ENTITY_PROPERTY_PASSWORD 			 = ENTITY_PROPERTY_START_TOKEN + 'password';
const ENTITY_PROPERTY_USERNAME 			 = ENTITY_PROPERTY_START_TOKEN + 'username';
const ENTITY_PROPERTY_EMAIL    			 = ENTITY_PROPERTY_START_TOKEN + 'email';
const ENTITY_PROPERTY_PHONE_NUMBER       = ENTITY_PROPERTY_START_TOKEN + 'phone_number';
const ENTITY_PROPERTY_PHONE_CARRIER      = ENTITY_PROPERTY_START_TOKEN + 'phone_carrier';

const ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE = ENTITY_PROPERTY_START_TOKEN + 'account_type';

// Account types.
// TODO : Not currently used.
const ACCOUNT_TYPE_NOT_VERIFIED = 'not_verified';
const ACCOUNT_TYPE_INTERNAL     = 'internal';
const ACCOUNT_TYPE_DEFAULT      = 'default';
const ACCOUNT_TYPE_ADMIN        = 'admin';
const ACCOUNT_TYPE_SUDO         = 'sudo';

// Entity type.
const ENTITY_TYPE_WALL = 'EntityWall';

// Entity properties.
const ENTITY_PROPERTY_WIDTH              = ENTITY_PROPERTY_START_TOKEN + 'width';
const ENTITY_PROPERTY_HEIGHT             = ENTITY_PROPERTY_START_TOKEN + 'height';
const ENTITY_PROPERTY_NORMAL             = ENTITY_PROPERTY_START_TOKEN + 'normal';
const ENTITY_PROPERTY_POSITION           = ENTITY_PROPERTY_START_TOKEN + 'position';
const ENTITY_PROPERTY_IS_ROOT_ATTACHABLE = ENTITY_PROPERTY_START_TOKEN + 'is_root_attachable';
const ENTITY_PROPERTY_3D_ROWS            = ENTITY_PROPERTY_START_TOKEN + '3d_rows';
const ENTITY_PROPERTY_2D_ROWS            = ENTITY_PROPERTY_START_TOKEN + '2d_rows';

// Entity types.
const ENTITY_TYPE_PICTURE = 'EntityFloatingPicture';

// Entity properties.
const ENTITY_PROPERTY_IMAGE_DATA = ENTITY_PROPERTY_START_TOKEN + 'image_data';
const ENTITY_TYPE_MONTH_VIEW_WALL     = 'EntityMonthViewWall';

const ENTITY_PROPERTY_MONTH_TYPE      = ENTITY_PROPERTY_START_TOKEN + 'month_type';
const ENTITY_PROPERTY_YEAR_TYPE       = ENTITY_PROPERTY_START_TOKEN + 'year_type';

const ENTITY_PROPERTY_MONTH_VIEW_TYPE = ENTITY_PROPERTY_START_TOKEN + 'month_view_type';
const MONTH_VIEW_TYPE_SIMPLE          = 'simple';
const MONTH_VIEW_TYPE_FULL            = 'full';

const ENTITY_TYPE_VIDEO = 'EntityVideo';

// World types.
const ENTITY_TYPE_DYNAMIC_WORLD = 'EntityDynamicWorld';
const ENTITY_TYPE_STATIC_WORLD  = 'EntityStaticWorld';

// World manager types.
const ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER = 'EntityDynamicWorldsManager';
const ENTITY_TYPE_STATIC_WORLDS_MANAGER  = 'EntityStaticWorldsManager';

// Static world types.
const ENTITY_STATIC_WORLD_HOME     = 'home';
const ENTITY_STATIC_WORLD_SETTINGS = 'settings';
const ENTITY_STATIC_WORLD_ADMIN    = 'admin';

# From entity_editor.js
const EDITOR_MODE_CREATE = 1;
const EDITOR_MODE_EDIT   = 2;

const ADD_NEW_FIELD_BUTTON_ROW = 'add_new_field_button';

# From text_syntax.js
const TEXT_SYNTAX_EMAIL           = 1;
const TEXT_SYNTAX_PASSWORD        = 2;
const TEXT_SYNTAX_REPEAT_PASSWORD = 3;
const TEXT_SYNTAX_USERNAME        = 4;

# From canvas_abstraction.js
const _SMUDGE_FACTOR = 0.85;

# From day_view_simple.js
const INDEX_OF_ENTITY = 0;
const INDEX_OF_ENTITY_BUTTON = 1;

# From player_menu.js
const INDEX_DYNAMIC_WORLD_OBJECT          = 0;
const INDEX_DYNAMIC_WORLD_TELEPORT_BUTTON = 1;

# From player_state.js
const PLAYER_STATE_PAUSED       = 1;
const PLAYER_STATE_AJAX         = 2;
const PLAYER_STATE_LOADING      = 3;
const PLAYER_STATE_ENGAGED      = 4;
const PLAYER_STATE_FULL_CONTROL = 5;
const PLAYER_STATE_TYPING       = 6;

# From time_constants.js
const TIME_DELTA_YEARS  = 1;
const TIME_DELTA_DAYS   = 2;
const TIME_DELTA_MONTHS = 3;

const TIME_TYPE_YEAR_CURRENT  = 21;
const TIME_TYPE_YEAR_STATIC   = 22;
const TIME_TYPE_MONTH_CURRENT = 23;
const TIME_TYPE_MONTH_STATIC  = 24;
const TIME_TYPE_DAY_CURRENT   = 25;
const TIME_TYPE_DAY_STATIC    = 26;

const MONTH_JANUARY   = 0;
const MONTH_FEBRUARY  = 1;
const MONTH_MARCH     = 2;
const MONTH_APRIL     = 3;
const MONTH_MAY       = 4;
const MONTH_JUNE      = 5;
const MONTH_JULY      = 6;
const MONTH_AUGUST    = 7;
const MONTH_SEPTEMBER = 8;
const MONTH_OCTOBER   = 9;
const MONTH_NOVEMBER  = 10;
const MONTH_DECEMBER  = 11;

const MONTH_JANUARY_STRING   = 'January';
const MONTH_FEBRUARY_STRING  = 'February';
const MONTH_MARCH_STRING     = 'March';
const MONTH_APRIL_STRING     = 'April';
const MONTH_MAY_STRING       = 'May';
const MONTH_JUNE_STRING      = 'June';
const MONTH_JULY_STRING      = 'July';
const MONTH_AUGUST_STRING    = 'August';
const MONTH_SEPTEMBER_STRING = 'September';
const MONTH_OCTOBER_STRING   = 'October';
const MONTH_NOVEMBER_STRING  = 'November';
const MONTH_DECEMBER_STRING  = 'December';

const DAY_MONDAY    = 0;
const DAY_TUESDAY   = 1;
const DAY_WEDNESDAY = 2;
const DAY_THURSDAY  = 3;
const DAY_FRIDAY    = 4;
const DAY_SATURDAY  = 5;
const DAY_SUNDAY    = 6;

const DAY_MONDAY_STRING    = 'Monday';
const DAY_TUESDAY_STRING   = 'Tuesday';
const DAY_WEDNESDAY_STRING = 'Wednesday';
const DAY_THURSDAY_STRING  = 'Thursday';
const DAY_FRIDAY_STRING    = 'Friday';
const DAY_SATURDAY_STRING  = 'Saturday';
const DAY_SUNDAY_STRING    = 'Sunday';
'''

data = RAW_DATA.split('\n')

sections = {}
section_name = ''

for d in data:
	if '# From' in d:
		section_name = d[d.index('From ') + len('From '):]
		sections[section_name] = []
	else:
		if 'const ' in d:
			name = d[d.index('const ') + len('const '):d.index(' = ')].rstrip()
			value = d[d.index(' = ') + len(' = '):d.index(';')]
			sections[section_name].append([name, value])


for s in sections:
	print('# From ' + s)
	for l in sections[s]:
		if type(l[1]) == str:
			print('_ac(${K}, ${V})'.replace('${K}', '\'' + str(l[0]) + '\'').replace('${V}', '"' + l[1] + '"'))
		else:
			print('_ac(${K}, ${V})'.replace('${K}', '\'' + str(l[0]) + '\'').replace('${V}', '\'' + str(l[1]) + '\''))
