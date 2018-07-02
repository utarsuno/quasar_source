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
    },

    create_gui_2d: function() {
        this.gui_2d_logs = new $_QE.prototype.CanvasGUI2DLines('_gui_2d_logs');
        this.gui_2d_logs.initialize(10, 0, 45, 70);
        //this.gui_2d_logs.set_text('Hello World Text 2D!');
        this.gui_2d_logs.add_row('Hello World!');
        this.gui_2d_logs.add_row('Second Line!');
        this.gui_2d_logs.add_row('. . .!');
        this.gui_2d_logs.add_row('Last Line!');
        QE.add_gui_2d_element(this.gui_2d_logs);

        this.gui_2d_typing = new $_QE.prototype.CanvasGUI2DText('_gui_2d_typing');
        this.gui_2d_typing.initialize(70, 10, 80, 10);
        //this.gui_2d_logs.set_text('Hello World Text 2D!');
        QE.add_gui_2d_element(this.gui_2d_typing);
    },

    engine_started: function() {
        l('engine started!!!');
        //QE.manager_world.current_world.logs.add_message('Hello worldsadasdasdasd!!!!');


        // $_QE.prototype.CanvasGUI2D = function(unique_name) {

    }

};

window.onload = function() {
    l('On load!');



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
