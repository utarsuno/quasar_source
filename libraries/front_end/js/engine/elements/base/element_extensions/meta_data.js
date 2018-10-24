'use strict';

// Features.
const EFLAG_TYPING                         = 'f0';  // #pre-process_global_constant
const EFLAG_OUTLINE_GLOW                   = 'f1';  // #pre-process_global_constant
const EFLAG_INTERACTIVE                    = 'f2';  // #pre-process_global_constant
const EFLAG_CACHEABLE_MESH                 = 'f3';  // #pre-process_global_constant
const EFLAG_CACHEABLE_MATERIAL             = 'f4';  // #pre-process_global_constant
const EFLAG_CACHEABLE_GEOMETERY            = 'f5';  // #pre-process_global_constant

const EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK = 'f6';  // #pre-process_global_constant
const EFLAG_NEEDS_ENGAGE_FOR_PARSING_INPUT = 'f7';  // #pre-process_global_constant

// Flags.
const EFLAG_ENGABLE                        = 'f8';  // #pre-process_global_constant
const EFLAG_CLICKABLE                      = 'f9';  // #pre-process_global_constant

const EFLAG_IS_BASE                        = 'f10'; // #pre-process_global_constant
const EFLAG_IS_ROOT                        = 'f11'; // #pre-process_global_constant
const EFLAG_IS_ROW_ELEMENT                 = 'f12'; // #pre-process_global_constant
const EFLAG_IS_SINGLETON                   = 'f13'; // #pre-process_global_constant

const EFLAG_FORMAT_X_START                 = 'f14'; // #pre-process_global_constant
const EFLAG_FORMAT_X_CENTER                = 'f15'; // #pre-process_global_constant
const EFLAG_FORMAT_X_END                   = 'f16'; // #pre-process_global_constant

// Mouse actions.
const EFLAG_MOUSE_MOVEABLE                 = 'f17'; // #pre-process_global_constant
const EFLAG_MOUSE_SCALEABLE                = 'f18'; // #pre-process_global_constant

// States.
const EFLAG_ENGAGED                        = 'f19'; // #pre-process_global_constant
const EFLAG_CREATED                        = 'f20'; // #pre-process_global_constant
const EFLAG_VISIBLE                        = 'f21'; // #pre-process_global_constant
const EFLAG_BEING_LOOKED_AT                = 'f22'; // #pre-process_global_constant

const EFLAG_UPDATE_POSITION                = 'f23'; // #pre-process_global_constant
const EFLAG_UPDATE_NORMAL                  = 'f24'; // #pre-process_global_constant
const EFLAG_UPDATE_CHILD                   = 'f25'; // #pre-process_global_constant
const EFLAG_UPDATE_COLOR                   = 'f26'; // #pre-process_global_constant

// 'External' states.
const EFLAG_IN_WORLD                       = 'f27'; // #pre-process_global_constant
const EFLAG_IN_ELEMENTS_ROOT               = 'f28'; // #pre-process_global_constant
const EFLAG_IN_ELEMENTS_INTERACTIVE        = 'f29'; // #pre-process_global_constant
const EFLAG_IN_ELEMENTS_SINGLETON          = 'f30'; // #pre-process_global_constant

//
// flag has children
// flag has parent
//


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


Object.assign($_QE.prototype.Element.prototype, $_QE.prototype.BooleanFlagsDynamic.prototype, {
    //_events: {},

    initialize_events_and_flags: function() {
        this._events = {};
        this.initialize_flags();
        this.set_flag(EFLAG_CREATED, false);
        this.set_flag(EFLAG_VISIBLE, true);
    },

    set_event: function(event_key, event_function) {
        if (event_key in this._events) {
            this._events[event_key] = [this._events[event_key]];
            this._events[event_key].push(event_function);
        } else {
            this._events[event_key] = event_function;
        }
    },

    clear_event: function(event_key) {
        if (event_key in this._events) {
            delete this._events[event_key];
        }
    },

    has_event: function(event) {
        return event in this._events;
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
});

