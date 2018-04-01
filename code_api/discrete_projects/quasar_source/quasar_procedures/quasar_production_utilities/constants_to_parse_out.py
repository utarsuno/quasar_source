# coding=utf-8

"""This module, constants_to_parse_out.py, is a utility program to store constants that need to get replaced in the minified file."""

constants_to_parse_out = {}


def _build_constants_to_parse_out():
	"""Utility function."""
	# From math_constants.js
	_ac('ONE_THIRD', '.3333')
	_ac('ONE_FOURTH', '.25')
	_ac('THREE_FOURTHS', '.75')
	_ac('TWO_THIRDS', '.6666')
	_ac('_INDEX_OF_POSITION', '0')
	_ac('_INDEX_OF_DIRECTION', '1')

	# From asset_group.js
	_ac('ASSET_GROUP_AUDIO', "'audio'")
	_ac('ASSET_GROUP_TEXTURE', "'texture'")

	# From audio_manager.js
	_ac('AUDIO_TYPING_SOUND', "'typing_sound.wav'")
	# From all_entity_property_files
	_ac('ENTITY_TYPE_BASE', "'Entity'")
	_ac('ENTITY_PROPERTY_START_TOKEN', "'ep_'")
	_ac('ENTITY_PROPERTY_NAME', "ENTITY_PROPERTY_START_TOKEN + 'name'")
	_ac('ENTITY_PROPERTY_CREATED_AT_DATE', "ENTITY_PROPERTY_START_TOKEN + 'created_at_date'")
	_ac('ENTITY_DEFAULT_PROPERTY_TYPE', "ENTITY_PROPERTY_START_TOKEN + 'type'")
	_ac('ENTITY_DEFAULT_PROPERTY_CHILD_IDS', "ENTITY_PROPERTY_START_TOKEN + 'child_ids'")
	_ac('ENTITY_DEFAULT_PROPERTY_PARENT_IDS', "ENTITY_PROPERTY_START_TOKEN + 'parent_ids'")
	_ac('ENTITY_DEFAULT_PROPERTY_RELATIVE_ID', "ENTITY_PROPERTY_START_TOKEN + 'relative_id'")
	_ac('ENTITY_PROPERTY_OWNER', "ENTITY_PROPERTY_START_TOKEN + 'owner'")
	_ac('ENTITY_TYPE_TASK', "'EntityTask'")
	_ac('ENTITY_PROPERTY_START_DATE_TIME', "ENTITY_PROPERTY_START_TOKEN + 'start_date_time'")
	_ac('ENTITY_PROPERTY_END_DATE_TIME', "ENTITY_PROPERTY_START_TOKEN + 'end_date_time'")
	_ac('ENTITY_PROPERTY_TIME_DURATION', "ENTITY_PROPERTY_START_TOKEN + 'time_duration'")
	_ac('ENTITY_PROPERTY_TIME_NEEDED', "ENTITY_PROPERTY_START_TOKEN + 'time_needed'")
	_ac('ENTITY_PROPERTY_GROUP_NAME', "ENTITY_PROPERTY_START_TOKEN + 'group_name'")
	_ac('ENTITY_PROPERTY_IMPORTANCE', "ENTITY_PROPERTY_START_TOKEN + 'importance'")
	_ac('ENTITY_PROPERTY_NOTE', "ENTITY_PROPERTY_START_TOKEN + 'note'")
	_ac('ENTITY_PROPERTY_TAGS', "ENTITY_PROPERTY_START_TOKEN + 'tags'")
	_ac('ENTITY_PROPERTY_COMPLETED', "ENTITY_PROPERTY_START_TOKEN + 'completed'")
	_ac('ENTITY_PROPERTY_COMPLETED_VALUE_NO', "'no'")
	_ac('ENTITY_PROPERTY_COMPLETED_VALUE_YES', "'yes'")
	_ac('ENTITY_TYPE_ENTITY_GROUP', "'EntityGroup'")
	_ac('ENTITY_TYPE_OWNER', "'EntityOwner'")
	_ac('ENTITY_PROPERTY_PASSWORD', "ENTITY_PROPERTY_START_TOKEN + 'password'")
	_ac('ENTITY_PROPERTY_USERNAME', "ENTITY_PROPERTY_START_TOKEN + 'username'")
	_ac('ENTITY_PROPERTY_EMAIL', "ENTITY_PROPERTY_START_TOKEN + 'email'")
	_ac('ENTITY_PROPERTY_PHONE_NUMBER', "ENTITY_PROPERTY_START_TOKEN + 'phone_number'")
	_ac('ENTITY_PROPERTY_PHONE_CARRIER', "ENTITY_PROPERTY_START_TOKEN + 'phone_carrier'")
	_ac('ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE', "ENTITY_PROPERTY_START_TOKEN + 'account_type'")
	_ac('ACCOUNT_TYPE_NOT_VERIFIED', "'not_verified'")
	_ac('ACCOUNT_TYPE_INTERNAL', "'internal'")
	_ac('ACCOUNT_TYPE_DEFAULT', "'default'")
	_ac('ACCOUNT_TYPE_ADMIN', "'admin'")
	_ac('ACCOUNT_TYPE_SUDO', "'sudo'")
	_ac('ENTITY_TYPE_WALL', "'EntityWall'")
	_ac('ENTITY_PROPERTY_WIDTH', "ENTITY_PROPERTY_START_TOKEN + 'width'")
	_ac('ENTITY_PROPERTY_HEIGHT', "ENTITY_PROPERTY_START_TOKEN + 'height'")
	_ac('ENTITY_PROPERTY_NORMAL', "ENTITY_PROPERTY_START_TOKEN + 'normal'")
	_ac('ENTITY_PROPERTY_POSITION', "ENTITY_PROPERTY_START_TOKEN + 'position'")
	_ac('ENTITY_PROPERTY_IS_ROOT_ATTACHABLE', "ENTITY_PROPERTY_START_TOKEN + 'is_root_attachable'")
	_ac('ENTITY_PROPERTY_3D_ROWS', "ENTITY_PROPERTY_START_TOKEN + '3d_rows'")
	_ac('ENTITY_PROPERTY_2D_ROWS', "ENTITY_PROPERTY_START_TOKEN + '2d_rows'")
	_ac('ENTITY_TYPE_PICTURE', "'EntityFloatingPicture'")
	_ac('ENTITY_PROPERTY_IMAGE_DATA', "ENTITY_PROPERTY_START_TOKEN + 'image_data'")
	_ac('ENTITY_TYPE_MONTH_VIEW_WALL', "'EntityMonthViewWall'")
	_ac('ENTITY_PROPERTY_MONTH_TYPE', "ENTITY_PROPERTY_START_TOKEN + 'month_type'")
	_ac('ENTITY_PROPERTY_YEAR_TYPE', "ENTITY_PROPERTY_START_TOKEN + 'year_type'")
	_ac('ENTITY_PROPERTY_MONTH_VIEW_TYPE', "ENTITY_PROPERTY_START_TOKEN + 'month_view_type'")
	_ac('MONTH_VIEW_TYPE_SIMPLE', "'simple'")
	_ac('MONTH_VIEW_TYPE_FULL', "'full'")
	_ac('ENTITY_TYPE_VIDEO', "'EntityVideo'")
	_ac('ENTITY_TYPE_DYNAMIC_WORLD', "'EntityDynamicWorld'")
	_ac('ENTITY_TYPE_STATIC_WORLD', "'EntityStaticWorld'")
	_ac('ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER', "'EntityDynamicWorldsManager'")
	_ac('ENTITY_TYPE_STATIC_WORLDS_MANAGER', "'EntityStaticWorldsManager'")
	_ac('ENTITY_STATIC_WORLD_HOME', "'home'")
	_ac('ENTITY_STATIC_WORLD_SETTINGS', "'settings'")
	_ac('ENTITY_STATIC_WORLD_ADMIN', "'admin'")
	# From canvas_abstraction.js
	_ac('_SMUDGE_FACTOR', "0.85")
	# From mobile_inputs.js
	_ac('TOUCH_EVENT_START', "'touchstart'")
	_ac('TOUCH_EVENT_END', "'touchend'")
	_ac('TOUCH_EVENT_CANCEL', "'touchcancel'")
	_ac('TOUCH_EVENT_MOVE', "'touchmove'")
	# From input_manager.js
	_ac('EVENT_MOUSE_DOWN', "'mousedown'")
	_ac('EVENT_MOUSE_UP', "'mouseup'")
	_ac('EVENT_KEY_DOWN', "'keydown'")
	_ac('EVENT_KEY_UP', "'keyup'")
	_ac('EVENT_MOUSE_MOVE', "'mousemove'")
	_ac('EVENT_PASTE', "'paste'")
	_ac('EVENT_WHEEL_V0', "'wheel'")
	_ac('EVENT_WHEEL_V1', "'mousewheel'")
	_ac('EVENT_WHEEL_V2', "'DOMMouseScroll'")
	# From cookie_manager.js
	_ac('COOKIE_SHOULD_REMEMBER_USERNAME', "'should_remember_username'")
	_ac('COOKIE_REMEMBERED_USERNAME', "'remembered_username'")
	# From time_constants.js
	_ac('TIME_DELTA_YEARS', "1")
	_ac('TIME_DELTA_DAYS', "2")
	_ac('TIME_DELTA_MONTHS', "3")
	_ac('TIME_TYPE_YEAR_CURRENT', "21")
	_ac('TIME_TYPE_YEAR_STATIC', "22")
	_ac('TIME_TYPE_MONTH_CURRENT', "23")
	_ac('TIME_TYPE_MONTH_STATIC', "24")
	_ac('TIME_TYPE_DAY_CURRENT', "25")
	_ac('TIME_TYPE_DAY_STATIC', "26")
	_ac('MONTH_JANUARY', "0")
	_ac('MONTH_FEBRUARY', "1")
	_ac('MONTH_MARCH', "2")
	_ac('MONTH_APRIL', "3")
	_ac('MONTH_MAY', "4")
	_ac('MONTH_JUNE', "5")
	_ac('MONTH_JULY', "6")
	_ac('MONTH_AUGUST', "7")
	_ac('MONTH_SEPTEMBER', "8")
	_ac('MONTH_OCTOBER', "9")
	_ac('MONTH_NOVEMBER', "10")
	_ac('MONTH_DECEMBER', "11")
	_ac('MONTH_JANUARY_STRING', "'January'")
	_ac('MONTH_FEBRUARY_STRING', "'February'")
	_ac('MONTH_MARCH_STRING', "'March'")
	_ac('MONTH_APRIL_STRING', "'April'")
	_ac('MONTH_MAY_STRING', "'May'")
	_ac('MONTH_JUNE_STRING', "'June'")
	_ac('MONTH_JULY_STRING', "'July'")
	_ac('MONTH_AUGUST_STRING', "'August'")
	_ac('MONTH_SEPTEMBER_STRING', "'September'")
	_ac('MONTH_OCTOBER_STRING', "'October'")
	_ac('MONTH_NOVEMBER_STRING', "'November'")
	_ac('MONTH_DECEMBER_STRING', "'December'")
	_ac('DAY_MONDAY', "0")
	_ac('DAY_TUESDAY', "1")
	_ac('DAY_WEDNESDAY', "2")
	_ac('DAY_THURSDAY', "3")
	_ac('DAY_FRIDAY', "4")
	_ac('DAY_SATURDAY', "5")
	_ac('DAY_SUNDAY', "6")
	_ac('DAY_MONDAY_STRING', "'Monday'")
	_ac('DAY_TUESDAY_STRING', "'Tuesday'")
	_ac('DAY_WEDNESDAY_STRING', "'Wednesday'")
	_ac('DAY_THURSDAY_STRING', "'Thursday'")
	_ac('DAY_FRIDAY_STRING', "'Friday'")
	_ac('DAY_SATURDAY_STRING', "'Saturday'")
	_ac('DAY_SUNDAY_STRING', "'Sunday'")
	# From entity_editor.js
	_ac('EDITOR_MODE_CREATE', "1")
	_ac('EDITOR_MODE_EDIT', "2")
	_ac('ADD_NEW_FIELD_BUTTON_ROW', "'add_new_field_button'")
	# From texture_manager.js
	_ac('TEXTURE_GROUP_SKYBOX', "'skybox'")
	_ac('TEXTURE_GROUP_CURSOR', "'cursors'")
	_ac('TEXTURE_GROUP_ICONS', "'icons'")
	_ac('ICON_STAR', "'star.png'")
	_ac('ICON_EXIT', "'exit.png'")
	_ac('ICON_SETTINGS', "'gear.png'")
	_ac('ICON_MULTI_PLAYER', "'multiplayer.png'")
	_ac('ICON_HOME', "'home.png'")
	_ac('ICON_SAVE', "'save.png'")
	_ac('ICON_ENTITY_GROUP', "'share.png'")
	_ac('ICON_FULLSCREEN', "'larger.png'")
	_ac('ICON_LEFT', "'arrow_left.png'")
	_ac('ICON_RIGHT', "'arrow_right.png'")
	_ac('ICON_CROSS', "'cross.png'")
	_ac('ICON_WORLDS', "'bars_horizontal.png'")
	_ac('ICON_LOCKED', "'locked.png'")
	_ac('ICON_UNLOCKED', "'unlocked.png'")
	_ac('ICON_WARNING', "'warning.png'")
	_ac('ICON_TELEPORT', "'open.png'")
	_ac('ICON_CHECKMARK', "'checkmark.png'")
	_ac('ICON_SINGLE_PLAYER', "'singleplayer.png'")
	_ac('ICON_WRENCH', "'wrench.png'")
	_ac('ICON_IMPORT', "'import.png'")
	_ac('ICON_INFORMATION', "'information.png'")
	_ac('ICON_MOVIE', "'movie.png'")
	_ac('ICON_MENU_LIST', "'menu_list.png'")
	_ac('SKYBOX_FRONT', "'skybox_front.jpg'")
	_ac('SKYBOX_BACK', "'skybox_back.jpg'")
	_ac('SKYBOX_LEFT', "'skybox_left.jpg'")
	_ac('SKYBOX_RIGHT', "'skybox_right.jpg'")
	_ac('SKYBOX_TOP', "'skybox_top.jpg'")
	_ac('SKYBOX_BOTTOM', "'skybox_bottom.jpg'")
	_ac('CURSOR_TYPE_HORIZONTAL', "'scroll_horizontal.png'")
	_ac('CURSOR_TYPE_VERTICAL', "'scroll_vertical.png'")
	_ac('CURSOR_TYPE_LARGER', "'larger.png'")
	_ac('CURSOR_TYPE_HAND', "'cursor_hand.png'")
	_ac('CURSOR_TYPE_POINTER', "'cursor_pointer.png'")
	_ac('CURSOR_TYPE_MOUSE', "'mouse.png'")
	# From player_menu.js
	_ac('INDEX_DYNAMIC_WORLD_OBJECT', "0")
	_ac('INDEX_DYNAMIC_WORLD_TELEPORT_BUTTON', "1")
	# From player_state.js
	_ac('PLAYER_STATE_PAUSED', "1")
	_ac('PLAYER_STATE_AJAX', "2")
	_ac('PLAYER_STATE_LOADING', "3")
	_ac('PLAYER_STATE_ENGAGED', "4")
	_ac('PLAYER_STATE_FULL_CONTROL', "5")
	_ac('PLAYER_STATE_TYPING', "6")
	# From day_view_simple.js
	_ac('INDEX_OF_ENTITY', "0")
	_ac('INDEX_OF_ENTITY_BUTTON', "1")
	# From text_syntax.js
	_ac('TEXT_SYNTAX_EMAIL', "1")
	_ac('TEXT_SYNTAX_PASSWORD', "2")
	_ac('TEXT_SYNTAX_REPEAT_PASSWORD', "3")
	_ac('TEXT_SYNTAX_USERNAME', "4")

	# Now make sure no constants appear in each other.

	replacement = {}

	global constants_to_parse_out
	for c in constants_to_parse_out:
		ignore_c = False
		for d in constants_to_parse_out:
			if d in c and d != c:
				ignore_c = True
		if not ignore_c:
			replacement[c] = constants_to_parse_out[c]

	constants_to_parse_out = replacement


def _ac(k, v):
	"""Utility function."""
	global constants_to_parse_out
	constants_to_parse_out[k] = v


def parse_out_constants(lines_to_parse):
	"""Returns the lines with certain constants parsed out."""

	global constants_to_parse_out
	if len(constants_to_parse_out) == 0:
		_build_constants_to_parse_out()

	# compressed{JS:quasar_prod_v_5135} - {473978b to 318834b} reduction of 155144 bytes or 32.73%
	# compressed{JS:quasar_prod_v_5135} - {473550b to 318496b} reduction of 155054 bytes or 32.74%

	# compressed{JS:quasar_prod_v_5188} - {474901b to 320686b} reduction of 154215 bytes or 32.47%
	# compressed{JS:quasar_prod_v_5188} - {474735b to 320526b} reduction of 154209 bytes or 32.48%

	# compressed{JS:quasar_prod_v_5188} - {474333b to 319414b} reduction of 154919 bytes or 32.66%
	# compressed{JS:quasar_prod_v_5188} - {464543b to 311047b} reduction of 153496 bytes or 33.04%
	# compressed{JS:quasar_prod_v_5188} - {464700b to 310879b} reduction of 153821 bytes or 33.10%
	# compressed{JS:quasar_prod_v_5188} - {462834b to 309036b} reduction of 153798 bytes or 33.22%
	# compressed{JS:quasar_prod_v_5188} - {462719b to 308886b} reduction of 153833 bytes or 33.24%

	lines = []

	for i in range(len(lines_to_parse)):
		l = lines_to_parse[i]

		ignore_line = False

		for c in constants_to_parse_out:
			if c in l:
				if ('const ' + c) in l:
					ignore_line = True

				if not ignore_line:
					l = l.replace(c, constants_to_parse_out[c])

		if not ignore_line:
			lines.append(l)

	return lines




