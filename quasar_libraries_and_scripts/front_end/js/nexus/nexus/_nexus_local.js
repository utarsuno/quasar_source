// Nexus Local starts here!

let NL;

function $_NL() {
    this.__init__();
}

$_NL.prototype = {
    __init__: function() {
        this.application_type = APPLICATION_NEXUS_LOCAL;
        this.first_world_class = $_NL.prototype.WorldDevTools;

        // The engine will reference these variables.
        // TODO : Make this a pre-processed step.
        this.engine_setting_audio_enabled          = false;
        this.engine_setting_shaders_enabled        = true;
        this.engine_setting_shader_fxaa_enabled    = true;
        this.engine_setting_shader_outline_enabled = true;
        this.engine_setting_shader_grain_enabled   = true;
    }
};

window.onload = function() {
    QE = new $_QE();
    QE.check_if_required_features_are_supported();
    if (QE.client.state_is_webgl_enabled && QE.client.state_is_canvas_enabled) {
        console.log('Run Nexus Local!!!');
        NL = new $_NL();
        QE.initialize_and_set_application(NL);
    } else {
        console.log('ERROR: WebGL or Canvas not supported!');
    }



    /*
    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        MANAGER_MANAGER.set_quasar_main_object(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER, MANAGER_MANAGER);

        MANAGER_MANAGER.initial_asset_loading_start(MANAGER_MANAGER.quasar_main_object);
    }
    */

};
