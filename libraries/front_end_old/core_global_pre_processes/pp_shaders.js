// From spritesheet shader.
const SHADER_UNIFORM_SPRITESHEET_OFFSET      = 'offset';  // #pre-process_global_constant
const SHADER_UNIFORM_SPRITESHEET_TEXTURE     = 'texture'; // #pre-process_global_constant
const SHADER_UNIFORM_SPRITESHEET_COLOR       = 'color';   // #pre-process_global_constant
const SHADER_UNIFORM_SPRITESHEET_ALPHA       = 'alpha';   // #pre-process_global_constant

// From transition shader.
const SHADER_UNIFORM_TRANSITION_NEW_SCENE   = 'texture_diffuse_new_scene'; // #pre-process_global_constant
const SHADER_UNIFORM_TRANSITION_OLD_SCENE   = 'texture_diffuse_old_scene'; // #pre-process_global_constant
const SHADER_UNIFORM_TRANSITION_MIX_RATIO   = 'mix_ratio';                 // #pre-process_global_constant
const SHADER_UNIFORM_TRANSITION_THRESHOLD   = 'threshold';                 // #pre-process_global_constant
const SHADER_UNIFORM_TRANSITION_TEXTURE_MIX = 'texture_mix';               // #pre-process_global_constant

// From noise shader.
const SHADER_UNIFORM_NOISE_T_DIFFUSE   = 'tDiffuse';   // #pre-process_global_constant
const SHADER_UNIFORM_NOISE_TIME        = 'time';       // #pre-process_global_constant
const SHADER_UNIFORM_NOISE_N_INTENSITY = 'nIntensity'; // #pre-process_global_constant

// From background shader.
const SHADER_UNIFORM_BACKGROUND_ASPECT      = 'aspect';     // #pre-process_global_constant
const SHADER_UNIFORM_BACKGROUND_GRAIN_SCALE = 'grainScale'; // #pre-process_global_constant
const SHADER_UNIFORM_BACKGROUND_GRAIN_TIME  = 'grainTime';  // #pre-process_global_constant
