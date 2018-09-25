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

    this.fatal_error = function(error_message, js_stack_trace=null) {
        l('------------------------------');
        if (js_stack_trace != null) {
            l(js_stack_trace);
        }
        l('------------------------------');
        l(error_message);
        l('------------------------------');
        this.manager_hud.show_error('Error ' + EMOJI_ERROR, error_message);
        //CURRENT_CLIENT.add_server_message_red(message);
        throw new QEFatalException(error_message);
    };

};
