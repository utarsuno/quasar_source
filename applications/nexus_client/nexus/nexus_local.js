// Nexus Local starts here!

function $_NL() {
    this.__init__();
}

$_NL.prototype = {

    __init__: function() {
        return this;
    },

    engine_started: function() {
        //l('engine started!!!');
    }

};

let NL;

window.onload = function() {
    NL = new $_NL();
    QE = new $_QE(NL, $_NL.prototype.WorldDevTools);
};
