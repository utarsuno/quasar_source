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

// States.
const EFLAG_IS_BASE                        = 'f8';  // #pre-process_global_constant
const EFLAG_IS_ROOT                        = 'f9';  // #pre-process_global_constant
const EFLAG_IS_ROW_ELEMENT                 = 'f10'; // #pre-process_global_constant
const EFLAG_ENGABLE                        = 'f11'; // #pre-process_global_constant
const EFLAG_CLICKABLE                      = 'f12'; // #pre-process_global_constant
const EFLAG_ENGAGED                        = 'f13'; // #pre-process_global_constant
const EFLAG_UPDATE_POSITION                = 'f14'; // #pre-process_global_constant
const EFLAG_UPDATE_NORMAL                  = 'f15'; // #pre-process_global_constant
const EFLAG_UPDATE_CHILD                   = 'f16'; // #pre-process_global_constant
const EFLAG_UPDATE_COLOR                   = 'f17'; // #pre-process_global_constant
const EFLAG_FORMAT_X_START                 = 'f18'; // #pre-process_global_constant
const EFLAG_FORMAT_X_CENTER                = 'f19'; // #pre-process_global_constant
const EFLAG_FORMAT_X_END                   = 'f20'; // #pre-process_global_constant
const EFLAG_CREATED                        = 'f21'; // #pre-process_global_constant

// Mouse actions.
const EFLAG_MOUSE_MOVEABLE                 = 'f22'; // #pre-process_global_constant
const EFLAG_MOUSE_SCALEABLE                = 'f23'; // #pre-process_global_constant

// 'External' states.
const EFLAG_IN_WORLD                       = 'f24'; // #pre-process_global_constant
const EFLAG_IN_ELEMENTS_ROOT               = 'f25'; // #pre-process_global_constant
const EFLAG_IN_ELEMENTS_INTERACTIVE        = 'f26'; // #pre-process_global_constant

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


$_QE.prototype.FloatingElementMetaData = function() {
    this._flags    = {};
    this._events   = {};

    this.set_flag = function(flag, value=true) {
        this._flags[flag] = value;
    };

    this.has_flag = function(flag) {
        return flag in this._flags;
    };

    this.get_flag = function(flag) {
        return flag in this._flags ? this._flags[flag] : false;
    };

    this.are_flags_on_and_off_respectively = function(flag0, flag1) {
        return this.get_flag(flag0) && !this.get_flag(flag1);
    };

    this.are_both_flags_on = function(flag0, flag1) {
        return (flag0 in this._flags) && (flag1 in this._flags) && (this._flags[flag0]) && (this._flags[flag1]);
    };

    this.consume_flag = function(flag) {
        if (flag in this._flags) {
            if (this._flags[flag]) {
                this._flags[flag] = false;
                return true;
            }
            return false;
        }
        return false;
    };

    this.set_event = function(event_key, event_function) {
        if (event_key in this._events) {
            this._events[event_key] = [this._events[event_key]];
            this._events[event_key].push(event_function);
        } else {
            this._events[event_key] = event_function;
        }
    };

    this.has_event = function(event) {
        return event in this._events;
    };

    this.trigger_event = function(event, data=null) {
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
    };
};
