'use strict';

const WS_ID_USER    = 0; // #pre-process_global_constant
const WS_ID_SESSION = 1; // #pre-process_global_constant

// Server to client.
const WS_TYPE_ESTABLISH_SESSION = 2; // #pre-process_global_constant
const WS_TYPE_SERVER_MESSAGE    = 4; // #pre-process_global_constant
// Client to server.
const WS_TYPE_GET_NUM_SESSIONS  = 1; // #pre-process_global_constant
const WS_TYPE_GLOBAL_CHAT       = 3; // #pre-process_global_constant

const WS_DATA_KEY_INT          = 0; // #pre-process_global_constant
const WS_DATA_KEY_TEXT         = 1; // #pre-process_global_constant

const _WEB_SOCKET_KEY_TYPE    = 't';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_ID      = 'm';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_SUCCESS = 's';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_DATA    = 'd';  // #pre-process_global_constant

// Message types.
const SERVER_MESSAGE_TYPE_CHAT             = 'm0'; // #pre-process_global_constant
const SERVER_MESSAGE_TYPE_COMMAND          = 'm1'; // #pre-process_global_constant
const SERVER_MESSAGE_TYPE_SAVE             = 'm2'; // #pre-process_global_constant
const SERVER_MESSAGE_TYPE_GET_NUM_SESSIONS = 'm3'; // #pre-process_global_constant

// Request types.

