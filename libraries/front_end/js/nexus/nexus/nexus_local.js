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

        //
        this.websocket_message_parser = new $_NL.prototype.WebsocketMessageHandler();
    },

    leave_typing_state: function() {
        l('Leaving typing state');
        QE.player.set_state(PLAYER_STATE_FULL_CONTROL);

        let text = QE.gui_2d_typing.get_text_then_clear();

        //l('THE TEXT IS {' + text + '}');

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
    QE = new $_QE();
    QE.ensure_required_features_are_enabled().then(function() {
        console.log('Engine loaded!');
        NL = new $_NL();
        QE.initialize_engine(NL);
    }).catch(function(err) {
        console.log(err);
        console.log('Engine failed to load!');
    });
};
