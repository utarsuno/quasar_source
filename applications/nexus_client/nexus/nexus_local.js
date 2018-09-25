// Nexus Local starts here!

let NL;
let QE;

function $_NL() {
    this.__init__();
}

$_NL.prototype = {
    __init__: function() {
        this.first_world_class = $_NL.prototype.WorldDevTools;
        this.world_environment = $_NL.prototype.WorldEnvironment;

        //
        this.websocket_message_parser = new $_NL.prototype.WebsocketMessageHandler();
    },

    parse_user_input_from_hud: function(user_input) {
        l('TODO: parse user input!');
        l('user input was {' + user_input + '}');
        /*
            if (text.startsWith('>')) {
                this.websocket_message_parser.send_request_cmd(text.substring(1));
            } else {
                this.websocket_message_parser.send_request_chat(text);
            }
         */
    },

    engine_started: function() {
        //l('engine started!!!');
        QE.manager_web_sockets.set_message_parser(this.websocket_message_parser);
    }

};

window.onload = function() {
    QE = new $_QE();
    QE.ensure_required_features_are_enabled().then(function() {
        NL = new $_NL();
        QE.initialize_engine(NL);
    }).catch(function(err) {
        QE.fatal_error(err);
    });
};
