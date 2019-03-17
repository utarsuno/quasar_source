'use strict';

const HEADER_INDEX_TYPE  = 0; // #pre-process_global_constant
const HEADER_INDEX_MID   = 1; // #pre-process_global_constant
const HEADER_INDEX_SID   = 2; // #pre-process_global_constant
const HEADER_INDEX_UID   = 3; // #pre-process_global_constant

const POOL_TYPE_SENT     = 0; // #pre-process_global_constant
const POOL_TYPE_RECEIVED = 1; // #pre-process_global_constant

// |2 bytes     |2 bytes   |2 bytes   |2 bytes|
// |message_type|message_id|session_id|user_id|

const WS_ID_INVALID = 1337; // #pre-process_global_constant

// Universal.
const WS_TYPE_MESSAGE_BUNDLE        = 60000; // #pre-process_global_constant
// Server to client.
const WS_TYPE_ESTABLISH_SESSION     = 2;     // #pre-process_global_constant
const WS_TYPE_SERVER_MESSAGE        = 4;     // #pre-process_global_constant
// Client to server.
const WS_TYPE_GLOBAL_CHAT           = 1;     // #pre-process_global_constant
const WS_TYPE_GET_NUM_SESSIONS      = 3;     // #pre-process_global_constant
const WS_TYPE_GET_ALL_NETWORK_STATS = 5;     // #pre-process_global_constant


const WS_DATA_KEY_INT          = 0; // #pre-process_global_constant
const WS_DATA_KEY_TEXT         = 1; // #pre-process_global_constant

const _WEB_SOCKET_KEY_TYPE    = 't';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_ID      = 'm';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_SUCCESS = 's';  // #pre-process_global_constant
const _WEB_SOCKET_KEY_DATA    = 'd';  // #pre-process_global_constant

