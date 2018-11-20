'use strict';

// First bit used to determine first or second bucket of flags.
const EFLAG_IS_TYPEABLE                              = 2;          // #pre-process_global_constant
const EFLAG_IS_INTERACTIVE                           = 4;          // #pre-process_global_constant
const EFLAG_IS_ENGABLE                               = 8;          // #pre-process_global_constant
const EFLAG_IS_CLICKABLE                             = 16;         // #pre-process_global_constant
const EFLAG_IS_MOUSE_MOVABLE                         = 32;         // #pre-process_global_constant
const EFLAG_IS_MOUSE_SCALABLE                        = 64;         // #pre-process_global_constant
const EFLAG_IS_ROOT                                  = 128;        // #pre-process_global_constant
const EFLAG_IS_SINGLETON                             = 256;        // #pre-process_global_constant
const EFLAG_IS_ROW_ELEMENT                           = 512;        // #pre-process_global_constant
const EFLAG_IS_CACHEABLE_MESH                        = 1024;       // #pre-process_global_constant
const EFLAG_IS_CACHEABLE_MATERIAL                    = 2048;       // #pre-process_global_constant
const EFLAG_IS_CACHEABLE_GEOMETRY                    = 4096;       // #pre-process_global_constant
const EFLAG_IS_VISIBLE                               = 8192;       // #pre-process_global_constant
const EFLAG_IS_CREATED                               = 16384;      // #pre-process_global_constant
const EFLAG_IS_BEING_LOOKED_AT                       = 32768;      // #pre-process_global_constant
const EFLAG_IS_ENGAGED                               = 65536;      // #pre-process_global_constant
const EFLAG_IS_FORMAT_X_START                        = 131072;     // #pre-process_global_constant
const EFLAG_IS_FORMAT_X_CENTER                       = 262144;     // #pre-process_global_constant
const EFLAG_IS_FORMAT_X_END                          = 524288;     // #pre-process_global_constant
const EFLAG_IS_LOCKED_FOREGROUND                     = 1048576;    // #pre-process_global_constant
const EFLAG_IS_LOCKED_BACKGROUND                     = 2097152;    // #pre-process_global_constant
const EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING    = 4194304;    // #pre-process_global_constant
const EFLAG_IS_INPUT_PARSEABLE_WITHOUT_ENGAGED_STATE = 8388608;    // #pre-process_global_constant
const EFLAG_IS_OUTLINE_GLOWABLE                      = 16777216;   // #pre-process_global_constant
const EFLAG_IS_UPDATED_NEEDED_FOR_POSITION           = 33554432;   // #pre-process_global_constant
const EFLAG_IS_UPDATED_NEEDED_FOR_NORMAL             = 67108864;   // #pre-process_global_constant
const EFLAG_IS_UPDATED_NEEDED_FOR_COLOR              = 134217728;  // #pre-process_global_constant
const EFLAG_IS_UPDATED_NEEDED_FOR_CHILD              = 268435456;  // #pre-process_global_constant
const EFLAG_IS_IN_ANIMATION                          = 536870912;  // #pre-process_global_constant
const EFLAG_IS_IN_WORLD                              = 1073741824; // #pre-process_global_constant
const EFLAG_IS_IN_ELEMENTS_ROOT                      = 3;          // #pre-process_global_constant
const EFLAG_IS_IN_ELEMENTS_INTERACTIVE               = 5;          // #pre-process_global_constant
const EFLAG_IS_IN_ELEMENTS_SINGLETON                 = 9;          // #pre-process_global_constant
const EFLAG_IS_IN_REVERSED_ANIMATION                 = 17;         // #pre-process_global_constant

// Events.
const ELEMENT_EVENT_ON_LOOK_AT             = 'e0';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_LOOK_AWAY           = 'e1';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_ENGAGE              = 'e2';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_DISENGAGE           = 'e3';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_WORLD_ENTER         = 'e4';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_WORLD_EXIT          = 'e5';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_FOREGROUND_COLOR    = 'e6';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_BACKGROUND_COLOR    = 'e7';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_SET_TO_BUTTON       = 'e8';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_MESH_CREATED        = 'e9';  // #pre-process_global_constant
const ELEMENT_EVENT_ON_NODE_UPDATE         = 'e10'; // #pre-process_global_constant
const ELEMENT_EVENT_ON_SET_TO_INTERACTIVE  = 'e11'; // #pre-process_global_constant
const ELEMENT_EVENT_ON_SET_TO_ATTACHMENT   = 'e12'; // #pre-process_global_constant


Object.assign(
    $_QE.prototype.Element.prototype,
    $_QE.prototype.BitwiseFlagsMax60.prototype,
    {
        initialize_events_and_flags: function() {
            this._events = {};
            this.flags   = new Uint32Array(2);
            this.flag_set_on(EFLAG_IS_VISIBLE);
        },

        set_event: function(event_key, event_function) {
            if (event_key in this._events && this._events[event_key] != null) {
                if (Array.isArray(this._events[event])) {
                    this._events[event_key].push(event_function);
                } else {
                    this._events[event_key] = [this._events[event_key], event_function];
                }
            } else {
                this._events[event_key] = event_function;
            }
        },

        clear_event: function(event_key) {
            if (event_key in this._events) {
                this._events[event_key] = undefined;
            }
        },

        trigger_event: function(event, data=null) {
            if (event in this._events) {
                if (data != null) {
                    if (Array.isArray(this._events[event])) {
                        let a;
                        for (a = 0; a < this._events[event].length; a++) {
                            this._events[event][a](data);
                        }
                    } else {
                        this._events[event](data);
                    }
                } else {
                    if (Array.isArray(this._events[event])) {
                        let a;
                        for (a = 0; a < this._events[event].length; a++) {
                            this._events[event][a]();
                        }
                    } else {
                        this._events[event]();
                    }
                }
            }
        },
    }
);

