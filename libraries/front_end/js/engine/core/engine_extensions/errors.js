'use strict';

Object.assign($_QE.prototype, {

    fatal_error: function(error_message, js_stack_trace=null) {
        if (js_stack_trace != null) {
            l('------------------------------');
            l(js_stack_trace);
        }
        l('------------------------------');
        l(error_message);
        l('------------------------------');
        this.pause_menu_show_error('Error ' + EMOJI_ERROR, error_message);
        //CURRENT_CLIENT.add_server_message_red(message);
        throw {
            name   : 'CustomException',
            message: error_message
        };
    },

    log_warning: function(warning_message, data) {
        // TODO: Eventually store all warnings.
        console.warn('Warning: ' + warning_message);
        //l(warning_message);
        l(data);
        l('-----------------------------------------');
    },

});
