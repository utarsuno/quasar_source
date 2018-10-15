'use strict';

const ENGINE_SETTING_STATE_AUDIO      = 0; // #pre-process_global_constant
const ENGINE_SETTING_STATE_SHADERS    = 1; // #pre-process_global_constant
const ENGINE_SETTING_STATE_FXAA       = 2; // #pre-process_global_constant
const ENGINE_SETTING_STATE_OUTLINE    = 3; // #pre-process_global_constant
const ENGINE_SETTING_STATE_GRAIN      = 4; // #pre-process_global_constant
const ENGINE_SETTING_STATE_TRANSITION = 5; // #pre-process_global_constant

Object.assign($_QE.prototype, {
    settings: new $_QE.prototype.BooleanFlagsStatic(6, true),
});
