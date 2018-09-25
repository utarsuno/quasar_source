'use strict';

function QEFatalException(message) {
    this.message = message;
    this.name    = 'CustomException';
}

/*
function raise_exception(message) {
    throw new CustomException(message);
}
 */

$_QE.prototype.ErrorManager = function() {

    this.fatal_error = function(error_message) {
        l(error_message);
        this.manager_hud.show_error(error_message);
        //CURRENT_CLIENT.add_server_message_red(message);
        throw new QEFatalException(error_message);
    };

};
