// Nexus Local starts here!

let NL;
let QE;

function $_NL() {
    this.__init__();
}

$_NL.prototype = {
    __init__: function() {
        this.application_type = APPLICATION_NEXUS_LOCAL;
        this.first_world_class = $_NL.prototype.WorldDevTools;
        this.world_environment = $_NL.prototype.WorldEnvironment;

        // The engine will reference these variables.
        // TODO : Make this a pre-processed step.
        this.engine_setting_audio_enabled          = false;
        this.engine_setting_shaders_enabled        = true;
        this.engine_setting_shader_fxaa_enabled    = true;
        this.engine_setting_shader_outline_enabled = true;
        this.engine_setting_shader_grain_enabled   = true;


        //
        this.websocket_message_parser = new $_NL.prototype.WebsocketMessageHandler();
    },

    create_gui_2d: function() {
        this.gui_2d_logs = new $_NL.prototype.GUI2DMessageLogs(32);
        this.gui_2d_typing = new $_NL.prototype.GUI2DPlayerTypingInput();
    },

    parse_key_event: function(event) {
        this.gui_2d_typing.parse_key_event(event);
    },

    enter_typing_state: function() {
        this.gui_2d_typing.render();
        this.gui_2d_typing.show();
    },

    leave_typing_state: function() {
        QE.player.set_state(PLAYER_STATE_FULL_CONTROL);

        let text = this.gui_2d_typing.get_text_then_clear();

        if (text !== null) {
            if (text.startsWith('>')) {
                this.websocket_message_parser.send_request_cmd(text.substring(1));
            } else {
                this.websocket_message_parser.send_request_chat(text);
            }
        }
    },

    engine_started: function() {
        l('engine started!!!');
        QE.manager_web_sockets.set_message_parser(this.websocket_message_parser);
    }

};

window.onload = function() {
    l('On load!');


    //return;

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
