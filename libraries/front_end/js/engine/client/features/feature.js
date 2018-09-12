'use strict';

const CLIENT_FEATURE_CANVAS       = 0; // #pre-process_global_constant
const CLIENT_FEATURE_WEBGL        = 1; // #pre-process_global_constant
const CLIENT_FEATURE_WEB_WORKERS  = 2; // #pre-process_global_constant
const CLIENT_FEATURE_MOBILE       = 3; // #pre-process_global_constant
const CLIENT_FEATURE_VR           = 4; // #pre-process_global_constant
const CLIENT_FEATURE_FULL_SCREEN  = 5; // #pre-process_global_constant
const CLIENT_FEATURE_POINTER_LOCK = 6; // #pre-process_global_constant

$_QE.prototype.ClientFeature = function(feature_type, feature_name, is_required, is_enabled) {
    this.name        = feature_name;
    this.type        = feature_type;
    this.is_required = is_required;
    this.is_enabled  = is_enabled;
};
