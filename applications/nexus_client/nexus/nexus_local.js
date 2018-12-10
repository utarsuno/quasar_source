// Nexus Local starts here!

function $_NL() {
    this.__init__();
}

$_NL.prototype = {

    __init__: function() {
        this.websocket_message_parser = new $_NL.prototype.WebsocketMessageHandler();
        return this;
    },

    parse_user_input_from_hud: function(user_input) {
        this.websocket_message_parser.parse_user_input_from_hud(user_input);
    },

    engine_started: function() {
        //l('engine started!!!');
        QE.manager_web_sockets.set_message_parser(this.websocket_message_parser);
    }

};

let NL;

window.onload = function() {
    NL = new $_NL();
    QE = new $_QE(NL, $_NL.prototype.WorldDevTools);
};
