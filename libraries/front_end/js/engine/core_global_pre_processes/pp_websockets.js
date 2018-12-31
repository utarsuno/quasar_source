'use strict';

//
// Current message sizes.
// message_type --> 1 byte
// message_id   --> 2 byte
// session_id   --> 2 byte
// user_id      --> 2 byte
// data_header  --> 2 bytes
// data         --> n bytes
//


const WS_ID_USER    = 0;    // #pre-process_global_constant
const WS_ID_SESSION = 1;    // #pre-process_global_constant

const WS_ID_INVALID = 1337; // #pre-process_global_constant

// If {WS_TYPE} is < 100, confirmation needed.
// Server to client.
const WS_TYPE_ESTABLISH_SESSION = 2;   // #pre-process_global_constant
const WS_TYPE_SERVER_MESSAGE    = 4; // #pre-process_global_constant
// Client to server.
const WS_TYPE_GLOBAL_CHAT       = 1;   // #pre-process_global_constant
const WS_TYPE_GET_NUM_SESSIONS  = 3; // #pre-process_global_constant

const WS_DATA_KEY_INT          = 0; // #pre-process_global_constant
const WS_DATA_KEY_TEXT         = 1; // #pre-process_global_constant

const _WEB_SOCKET_KEY_TYPE    = 't';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_ID      = 'm';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_SUCCESS = 's';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_DATA    = 'd';  // #pre-process_global_constant

